<?php
header('Content-Type: application/json');

function readCSV($fileName) {
    $rows = [];
    if (($handle = fopen($fileName, "r")) !== FALSE) {
        $headers = fgetcsv($handle);
        while (($data = fgetcsv($handle)) !== FALSE) {
            $rows[] = array_combine($headers, $data);
        }
        fclose($handle);
    }
    return $rows;
}
function writeCSV($fileName, $data) {
    if (($handle = fopen($fileName, "w")) !== FALSE) {
        fputcsv($handle, array_keys($data[0]));

        foreach ($data as $row) {
            fputcsv($handle, $row);
        }

        fclose($handle);
        return true;
    } else {
        return false;
    }
}

$requestMethod = $_SERVER['REQUEST_METHOD'];
$uriSegments = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$studentId = $uriSegments[2] ?? null;

if ($requestMethod == 'GET') {
    if ($studentId === null) {
        echo json_encode(readCSV('students.csv'));
    } else {
        $student = getRecordById('students.csv', $studentId);
        if ($student !== null) {
            echo json_encode($student);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Student not found']);
        }
    }
}function getMaxStudentId($data) {
    $maxId = 0;
    foreach ($data as $item) {
        $itemId = (int)$item['id'];
        if ($itemId > $maxId) {
            $maxId = $itemId;
        }
    }
    return $maxId;
}

function addStudent($newStudentData) {
    $data = readCSV('students.csv'); 
    $maxId = getMaxStudentId($data);
    $newId = $maxId + 1;

    $newStudent = [
        'id' => $newId,
        'lastname' => $newStudentData['lastname'],
        'firstname' => $newStudentData['firstname'],
        'email' => $newStudentData['email'],
        'phone' => $newStudentData['phone'],
        'address' => $newStudentData['address'],
        'zip' => $newStudentData['zip'],
        'city' => $newStudentData['city'],
        'class' => $newStudentData['class']
    ];

    $data[] = $newStudent; 
    writeCSV('students.csv', $data); 
}

if ($requestMethod == 'POST') {
    $postData = json_decode(file_get_contents("php://input"), true);

    if (
        isset($postData['lastname']) &&
        isset($postData['firstname']) &&
        isset($postData['email']) &&
        isset($postData['phone']) &&
        isset($postData['address']) &&
        isset($postData['zip']) &&
        isset($postData['city']) &&
        isset($postData['class'])
    ) {
        addStudent($postData);
        http_response_code(201);
        echo json_encode(['message' => 'Étudiant créé avec succès']);
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Données POST invalides']);
    }
}

if ($requestMethod == 'PATCH') {
    $patchData = json_decode(file_get_contents("php://input"), true);
    $studentId = $uriSegments[2] ?? null;

    if ($studentId !== null) {
        $student = getRecordById('students.csv', $studentId);
        if ($student !== null) {
            foreach ($patchData as $key => $value) {
                if (isset($student[$key])) {
                    $student[$key] = $value;
                }
            }
            $data = readCSV('students.csv');
            foreach ($data as $index => $row) {
                if ($row['id'] == $studentId) {
                    $data[$index] = $student;
                    break;
                }
            }
            writeCSV('students.csv', $data);

            http_response_code(200);
            echo json_encode(['message' => 'Étudiant mis à jour avec succès']);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Student not found']);
        }
    }
}

if ($requestMethod == 'PUT') {
    $putData = json_decode(file_get_contents("php://input"), true);
    $studentId = $uriSegments[2] ?? null;

    if ($studentId !== null) {
        $student = getRecordById('students.csv', $studentId);
        if ($student !== null) {
            $student = $putData;

            $data = readCSV('students.csv');
            foreach ($data as $index => $row) {
                if ($row['id'] == $studentId) {
                    $data[$index] = $student;
                    break;
                }
            }
            writeCSV('students.csv', $data);

            http_response_code(200);
            echo json_encode(['message' => 'Étudiant mis à jour avec succès']);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Student not found']);
        }
    }
}

function getRecordById($fileName, $id) {
    if (($handle = fopen($fileName, "r")) !== FALSE) {
        $headers = fgetcsv($handle);
        while (($data = fgetcsv($handle)) !== FALSE) {
            if ($data[0] == $id) {
                return array_combine($headers, $data);
            }
        }
        fclose($handle);
    }
    return null;
}
?>
