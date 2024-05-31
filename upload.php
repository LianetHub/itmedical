<?php  
if(!empty($_FILES['file'])){ 
     
    // File upload configuration 
    $targetDir = "uploads/"; 
    $allowTypes = array('pdf', 'doc', 'docx', 'jpg', 'png', 'jpeg', 'gif', 'ppt', 'pptx'); 
     
    $fileName = basename($_FILES['file']['name']); 
    $targetFilePath = $targetDir.$fileName; 
     
    // Check whether file type is valid 
    $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION); 
    if(in_array($fileType, $allowTypes)){ 
        // Upload file to the server 
        if(move_uploaded_file($_FILES['file']['tmp_name'], $targetFilePath)){ 
            $result = array(
                'status' => true,
                'message' => 'Uploaded successfully'
            );
        }  else {
            $result = array(
                'status' => false,
                'message' => 'Some error with uploading'
            );
        }
    } else {
        $result = array(
            'status' => false,
            'message' => 'Some error with filetype'
        );
    }
} else {
    $result = array(
        'status' => false,
        'message' => 'Some error'
    );
}
echo json_encode($result);
?>