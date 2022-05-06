import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/account-styles.css';
import Backendless from "backendless";
import axios from 'axios';
import fileDownload from "js-file-download";

function Account() {

    const [user, setUser] = useState({})
    const [file, setFile] = useState()
    const [avatar, setAvatar] = useState('')
    const [avatarURL, setAvatarURL] = useState({})
    const [userFiles, setUserFiles] = useState([])
    const [fileURL, setFileURL] = useState('')

    const navigate = useNavigate()

    const getUser = async () => {
        try{
            setUser(await Backendless.UserService.getCurrentUser())
        } catch(err) {
            console.error(err)
        }
    }

    const LogOut = async () => {
        try{
            await Backendless.UserService.logout()
            navigate('/login', { replace: true })
        } catch(err) {
            console.error(err)
        }
    }

    const uploadFile = async () => {
        try{

            const URL = await Backendless.Files.upload(file, user.name, true)
            alert('Your file was uploaded')
        } catch(err) {
            console.error(err)
        }
    }

    const uploadAvatar = async () => {
        try {

            const URL = await Backendless.Files.upload(avatar, `${user.name}/avatar`, true)
            setAvatarURL(URL)
            alert('Your avatar was uploaded')
            console.log(URL)
        } catch(err) {
            console.log(err)
        }
    }

    const getAvatar = async () => {
        try {
            const [ currentAvatar ] = await Backendless.Files.listing(`/${user.name}/avatar`, '*', true)
            setAvatar(currentAvatar.publicUrl)
        } catch(err) {
            console.log(err)
        }
    }

    const getUserFiles = async () => {
        try {
            const files = await Backendless.Files.listing(`/${user.name}`, '*.*', true)
            setUserFiles(files)
        } catch(err) {
            alert(err)
        }
    }

    const downloadFile = async (fileName) => {
        try {
            const res = await axios.get(
                `https://eu.backendlessappcontent.com/34B1584C-F24F-4764-FF20-7119C78FAD00/087FFB8B-902E-4389-85EF-83CB89874E7D/files/${user.name}/${fileName}`,
                { responceType: 'blob' })
            await fileDownload(res.data, fileName)
            console.log(res)
        } catch(err) {
            console.log(err)
        }
    }

    const deleteFile = async (filePath) => {
        try {
            await Backendless.Files.remove(filePath)
            alert('Your file was removed')
        } catch(err) {
            console.log(err)
        }
    }

    useEffect( () => {
        const fetchData = async () => {
            await getUser()
            await getAvatar()
        }

        fetchData()
    })

    return(
        <div className="account-container">
            <div className="account-content">
                {user ?
                    <div className="">
                        <div className="user-info">
                            <div className="user-info-title">
                                <p>{user.email}</p>
                                <p>{user.country}</p>
                            </div>
                            <div className="user-info-avatar">
                                <img src={avatar} alt="avatar" width="35px" height="35px"/>
                                <input type="file" onChange={event => setAvatar(event.target.files[0])}/>
                                <button onClick={uploadAvatar}>Choose avatar</button>
                            </div>
                        </div>
                        <button onClick={LogOut} className="submit-logout">Log out</button><br />
                        <div className="upload-file-form">
                            <input type="file" onChange={event => setFile(event.target.files[0])}/>
                            <button onClick={uploadFile}>Upload</button>
                        </div>
                        <div className="user-files">
                            <button onClick={getUserFiles}>Get Files</button>
                            {userFiles.length !== 0 ?
                                <div className="user-file-list">
                                    {userFiles.map((file, index) => {
                                        return(
                                            <div className="file-container" key={index}>
                                                <p className="file-name">{file.name}</p>
                                                <button className="download-button" onClick={() => downloadFile(file.name)}>Download</button>
                                                <img src={file.publicUrl} alt="user-files" width="50px" height="50px"/>
                                                <button className="download-button" onClick={() => deleteFile(file.publicUrl)}>X</button>
                                            </div>
                                        )
                                    })}
                                </div>
                            :
                                <div className="user-file-list">
                                    <p>At that moment you don`t have any files</p>
                                </div>
                            }
                        </div>
                    </div>
                :
                    <div className="">
                        <p>Log in please</p>
                    </div>
                }
            </div>
        </div>
    )
}

export default Account;