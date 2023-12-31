import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import "./LoginStyles.css"
import { baseUrl } from './baseUl'
const Login = ({ setIsLogin }) => {
    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    //code for update the formdata
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const navigate = useNavigate()
    ///code for login
    const handleLogin = async () => {
        setLoading(true)
        validateForm()
        const config = { headers: { "Content-Type": "Application/json" } }
        if (validateForm() === true) {
            await axios.post(`${baseUrl}/admin/login/${formData.email}`, formData, config)
                .then((res) => {
                    localStorage.setItem("AdminInfo", JSON.stringify(res.data))
                    toast.success(`You have successfully logged in.`)
                    setIsLogin(true)
                    navigate("/")
                    setLoading(false)
                })
                .catch(err => {
                    setErrors(err.response.data)
                    console.log(err.message)
                    setLoading(false)
                })
        }
        setLoading(false)
    }

    const validateForm = () => {
        let isValidForm = true
        let errors = {}
        //for email validations
        if (!formData.email) {
            errors["email"] = "Please enter your email"
            isValidForm = false
        }
        ///for password validations
        if (!formData.password) {
            errors["password"] = "Please enter your password"
            isValidForm = false
        } else if (formData.password.length < 6) {
            errors["password"] = "Password should be greater than 6 characters"
            isValidForm = false
        }
        setErrors(errors)
        return isValidForm
    }
    const hideErros = (e) => {
        setErrors({ ...errors, [e.target.name]: "" })
    }
    const showErrors = (e) => {
        e.target.value !== "" && validateForm()
    }
    return (
        <div className='loginForm border border-2 rounded bg-light p-5 mx-auto my-5'>
            <h4 className='text-center text-decoration-underline'>Applicant Tracking System</h4>
            <form className='mt-4' onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label style={{ fontWeight: "600" }} htmlFor="inputEmail">Enter your email :</label>
                    <input className="form-control" type="email" name="email" onBlur={showErrors} onChange={handleInputChange} onFocus={hideErros} placeholder="" />
                    {
                        errors.email && <p className='text-danger'>{errors.email}</p>
                    }
                </div>
                <div className="form-group">
                    <label style={{ fontWeight: "600" }} htmlFor="inputPassword">Password :</label>
                    <input className="form-control" type="password" onBlur={showErrors} name="password" onChange={handleInputChange} onFocus={hideErros} placeholder="" />
                    {
                        errors.password && <p className='text-danger'>{errors.password}</p>
                    }
                </div>

                {
                    loading ? <button className="btn btn-info w-100" style={{ fontWeight: "600" }} type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Login... </button>
                        : <button onClick={handleLogin} type="submit" className="btn btn-primary w-100" style={{ fontWeight: "600" }} disabled={loading}>Login</button>
                }
            </form>
        </div>
    )
}

export default Login

