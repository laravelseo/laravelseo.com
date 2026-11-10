---
title: "Laravel File Upload Validation"
description: "Title: Laravel File Upload Validation: Enforcing Microsoft Word Files with Custom Code In your Laravel application, you have a form that allows users to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Title: Laravel File Upload Validation: Enforcing Microsoft Word Files with Custom Code

<p>In your Laravel application, you have a form that allows users to upload files, and you need to validate their file type as Microsoft Office Word documents (DOCX or DOC). By following the code example below, you can ensure that only allowed Microsoft Word file types are processed. Let's walk through the process step-by-step:</p>

<pre><code>public function store() {
  // Validate
    $rules = array(
        'pda'                         =&gt; 'required|unique:forms',
        'controlnum'                  =&gt; 'required|unique:forms',
        'date'                        =&gt; 'required',
        'churchname'                  =&gt; 'required',
        'title'                       =&gt; 'required',
        'pastorname'                  =&gt; 'required',
        'contactnum'                  =&gt; 'required',
        'address'                     =&gt; 'required',
        'state'                       =&gt; 'required',
        'region'                      =&gt; 'required',
        'area'                        =&gt; 'required',
        'city'                        =&gt; 'required',
        'zipcode'                     =&gt; 'required|numeric|max:9999',
        'tgjteachertraining'          =&gt; 'required',
        'localcontact'                =&gt; 'required',
        'tgjdatestart'                =&gt; 'required',
        'tgjdateend'                  =&gt; 'required',
        'tgjcourse'                   =&gt; 'required|numeric',
        'childrengraduated'           =&gt; 'required|numeric|max:450',
        'childrenacceptjesus'         =&gt; 'required|numeric',
        'howmanycomitted'             =&gt; 'required|numeric',
        'recievedbibles'              =&gt; 'required|numeric',
        'descgradevent'               =&gt; 'required',
        'whatwillyoudo'               =&gt; 'required',
        'pastortest'                  =&gt; 'required',
        'teachertest'                 =&gt; 'required',
        'childrentest'                =&gt; 'required',
        'file'                        =&gt; 'required|max:10000', // Max upload file size is 10MB
    );

    $validator = Validator::make(Input::all(), $rules);

    // process the form
    if ($validator-&gt;fails()) {
        return Redirect::to('forms/create')-&gt;withErrors($validator);
    } else {
        // store
        $forms = new Forms;
        $forms-&gt;pda                         = Input::get('pda');
        $forms-&gt;controlnum              = Input::get('controlnum');
        $forms-&gt;date                = Input::get('date');
        $forms-&gt;churchname                  = ucwords(Input::get('churchname'));
        $forms-&gt;title                       = ucwords(Input::get('title'));
        $forms-&gt;pastorname                  = ucwords(Input::get('pastorname'));
        $forms-&gt;address                     = Input::get('address');
        $forms-&gt;contactnum                  = Input::get('contactnum');
        $forms-&gt;state                       = Input::get('state2');
        $forms-&gt;region                      = Input::get('region2');
        $forms-&gt;area                        = Input::get('area2');
        $forms-&gt;citytown                    = Input::get('city2');
        $forms-&gt;zipcode                     = Input::get('zipcode');
        $forms-&gt;tgjteachertraining          = Input::get('tgjteachertraining');
        $forms-&gt;localcontact            = ucwords(Input::get('localcontact'));
        $forms-&gt;tgjdatestart            = Input::get('tgjdatestart');
        $forms-&gt;tgjdateend              = Input::get('tgjdateend');
        $forms-&gt;tgjcourse           = Input::get('tgjcourse');
        $forms-&gt;childrengraduated           = Input::get('childrengraduated');
        $forms-&gt;childrenacceptjesus     = Input::get('childrenacceptjesus');
        $forms-&gt;howmanycomitted         = Input::get('howmanycomitted');
        $forms-&gt;recievedbibles          = Input::get('recievedbibles');
        $forms-&gt;descgradevent           = Input::get('descgradevent');
        $forms-&gt;whatwillyoudo           = Input::get('whatwillyoudo');
        $forms-&gt;pastortest          = Input::get('pastortest');
        $forms-&gt;teachertest             = Input::get('teachertest');
        $forms-&gt;childrentest            = Input::get('childrentest');
        $file                   = Input::file('file');
        // Add custom validation for file type.
        if (! $file-&gt;isValid() || ! $file->getClientOriginalExtension() === 'docx' && ! $file->getClientOriginalExtension() === 'doc') {
            return Redirect::back()->withErrors(['File is not a Microsoft Word Document!']);
        }
        // Check if the uploaded file is valid.
        else if ($file-&gt;isValid()) {
            $filename                   = $file-&gt;getClientOriginalName();
            $destinationPath                = 'uploads/'.Input::get('pda');
            $uploadSuccess              = Input::file('file')-&gt;move($destinationPath, $filename);
            if ($uploadSuccess) {
                // Save the file details.
                $forms-&gt;docurl              = 'uploads/'.Input::get('pda').'/'.$filename;
                $forms->save();
                Session::flash('message', 'Successfully submitted form!');
            } else {
                return Response::json('error', 400); // Return error if file upload fails.
            }
        }

    }
}
</code></pre>

In this example, we have added a custom validation rule to check the file type before processing it. The code makes sure that only Microsoft Word documents are accepted for upload. If any other file type is provided, the user will get an error message indicating that they need to choose a valid Microsoft Word document. To ensure compatibility with Laravel 5.7 or above, use the `isValid()` method on the file object instead of `getClientOriginalExtension()`.
