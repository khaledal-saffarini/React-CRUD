import React, { Fragment, useState, useEffect } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [username, setusername] = useState("");
  const [userphoto, setuserphoto] = useState("");
  const [userid, setuserid] = useState("");
  const [userlist, setuserlist] = useState([]);
  const [NewName, setNewName] = useState("");
  const [photo, setphoto] = useState("");


  useEffect(() => {

    axios.get("/react/show").then((respone) => {
      setuserlist(respone.data);
        console.log("-----------------------------------");
        console.log(respone);
        // alert("successfuly show ");
    });

  }, []);

  const deletedata = (userid) => {
    axios.delete(`/react/delete/${userid}`);
    console.log(userid);
  };


  const updatedata = (userid) => {
    axios.put(`/react/update/`,
      {
        userid: userid,
        username: NewName
      });
  };


  // -------------------------------------------------------------------
  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);
    formData.append('userphoto', userphoto);
    formData.append('userid', userid);
    console.log(userid)
    console.log(userphoto)
    console.log(username)
    console.log("============-------------============-------------");

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <div className="card container">
        <div>
        <label > User Id  </label>

        <input type="text" name="userid" onChange={(e) => {
          setuserid(e.target.value)
        }} />
        </div>
        <div>
        <label > User Name </label>

        <input type="text" name="username" onChange={(e) => {
          setusername(e.target.value)
        }} />
        </div>

        <form onSubmit={onSubmit}>
          <div className='custom-file mb-4'>
            <input
              type='file'
              className='custom-file-input'
              id='customFile'
              onChange={onChange}
            />
            <label className='custom-file-label' htmlFor='customFile'>
              {filename}
            </label>
          </div>

          <Progress percentage={uploadPercentage} />

          <input
            type='submit'
            value='Upload'
            className='btn btn-primary btn-block mt-4'
          />
        </form>
        {uploadedFile ? (
          <div className='row mt-5'>
            <div className='col-md-6 m-auto'>
              <h3 className='text-center'>{uploadedFile.fileName}</h3>
              <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
            </div>
          </div>
        ) : null}
      </div>

      <hr></hr>
      {userlist.map((val) => {
        return (
          <div className="card container">
            <h2>{val.uName} </h2>
            <img style={{ width: '50%' }} src={val.photo}></img>
            <div >
            <button  style={{ width: '30%' }}  onClick={() => { deletedata(val.id) }}>delete </button>
             <input  style={{ width: '30%' }}  type="text" name="updateInput" onChange={(e) => { 
            setNewName(e.target.value)}} /> 
            <button  style={{ width: '30%' }} onClick={() => { updatedata(val.id) }}>update </button>
            </div>
          </div>
        )
      })}
    </Fragment>
  );
};

export default FileUpload;
