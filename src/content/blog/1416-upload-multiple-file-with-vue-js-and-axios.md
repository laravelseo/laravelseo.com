---
title: "Upload multiple file with vue js and axios"
description: "Title: Upload Multiple Files Using Vue JS and Axios Introduction: In this comprehensive guide on how to upload multiple files using Vue JS and Axios, we will..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "JavaScript", "HTML"]
featured: false
---

Title: Upload Multiple Files Using Vue JS and Axios

Introduction: In this comprehensive guide on how to upload multiple files using Vue JS and Axios, we will cover the necessary steps involved in configuring your app for handling file uploads, the structure of the frontend code, server-side implementation, and debugging if you encounter issues. By the end of this tutorial, you should be able to successfully implement a multi-file uploader in your Vue JS application using Axios.

1. Configuring Your App for File Uploads: Firstly, we need to enable file uploading in our Vue JS app by adding multipart/form-data support in the content type of the HTTP request. Axios supports this out of the box as its default mode is 'multipart'.

2. Frontend Code Structure: To handle multiple files for uploading, we will use file inputs with the attribute "multiple". We can add a file input and other necessary elements in a div element to make it responsive and user-friendly. Here's an example of the HTML code you should include:

<form method="post" action="#" id="" enctype="multipart/form-data">
    <div class="form-group files text-center" ref="fileform">
        <input type="file" multiple="multiple">
        <span id='val'></span>
        <a class="btn" @click="submitFiles()" id='button'>Upload Photo</a>
        <h6>DRAG & DROP FILE HERE</h6>
    </div>
</form>

3. Vue JS Code for File Upload: To upload files using Axios, we need to initialize a FormData object and iterate over the file inputs, appending each file to the form data. Then, we can make an asynchronous request to your server-side endpoint with the appropriate headers and form data. Here's a sample Vue JS code snippet for submitting multiple files:

<script>
  export default {
    methods: {
      submitFiles() {
        /* Initialize the form data */
        let formData = new FormData();

        /* Iterate over any file sent and append it to form data */
        for( var i = 0; i < this.files.length; i++ ){
          let file = this.files[i];
          console.log(file);
          formData.append('files[' + i + ']', file);
        }

        /* Make the request to the POST /fileupload URL */
        axios.post('/file-drag-drop',
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
          })
        .then(function(){})
        .catch(function(){});
      }
    }
  };
</script>

4. Server-Side Implementation: The server-side code for handling the incoming file upload request needs to be properly coded and debugged. A simple example would be an API endpoint that receives the form data sent from the client, parses it, and saves the files locally or in a database as required.

5. Debugging Your Implementation: If you encounter issues while uploading multiple files using Vue JS and Axios, ensure all the necessary headers are set on both the frontend and backend to enable proper file handling. Additionally, check your server logs for any errors that might help in resolving the issue.

Conclusion: In this blog post, we have covered how to upload multiple files with Vue JS and Axios, including a detailed explanation of the code structure, frontend implementation, server-side handling, and debugging techniques. With this knowledge, you should be able to develop a seamless file uploading system in your Vue JS application using Axios for efficient and reliable data transfer.
