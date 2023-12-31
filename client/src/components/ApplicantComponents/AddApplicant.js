import React, { useState } from 'react';
import axios from "axios"
import { useDispatch } from 'react-redux';
import { fetchApplicants } from '../../Redux/applicantSlice';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../baseUl';
const roles = ["ML-Lead", "ML-Engineer", 'MERN Stack Developer', 'Web-dev lead', 'React JS Developer', 'Node Js Developer', 'Test Engieer', 'Java Developer', 'Python Developer', "VLSI Design Engineer", "Embedded Engineer", "Others"];
const qualifications = ['Master of Engineering', 'Master of Technology', 'Bachelor of Engineering', 'Bachelor of Technology', "Bachelor's degree", "Others"];
const branches = ['Computer Science Engineering', 'Information Technology', 'Electronics and Communication Engineering', "Electrical and Electronic Engineering", "Mechanical Engineering", 'Others'];
const area = ['Software', 'VLSI', 'VLSI_Fresher', 'Embedded']
const AddApplicant = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    collegeName: '',
    qualification: '',
    branch: '',
    role: '',
    area: '',
    passout: '',
    resumeLink: '',
    isExperienced: '',
    previousCompany: '',
    experience: '0'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  ////validations for form
  const validate = () => {
    let errors = {};
    if (!formData.name) {
      errors.name = 'Name is required';
    } else if (!/^[a-zA-Z ]+$/.test(formData.name.trim())) {
      errors.name = 'Name should contain only alphabets and spaces';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.mobile) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      errors.mobile = 'Mobile number should contain only 10 digits';
    } else if (!/^[6-9]\d{9}/.test(formData.mobile)) {
      errors.mobile = "Invalid mobile number"
    }
    if (!formData.collegeName) {
      errors.collegeName = 'College name is required';
    } else if (!/^[A-Za-z ]+$/.test(formData.collegeName.trim())) {
      errors.collegeName = "College name should only contain alphabets and spaces";
    }

    const fieldsToValidate = ['qualification', 'branch', 'role', 'area'];

    for (const field of fieldsToValidate) {
      if (!formData[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    }
    if (!formData.passout) {
      errors.passout = 'Passout year is required';
    } else if (!/^(200\d|201\d|202[0-3])/.test(formData.passout)) {
      errors.passout = "Please enter valid passout year."
    }
    if (!formData.resumeLink) {
      errors.resumeLink = 'Resume link is required';
    } else if (!/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(formData.resumeLink.trim())) {
      errors.resumeLink = "Resume link should be a valid URL";
    }
    //  if (!/^https?:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view\?usp=sharing+$/.test(formData.resumeLink)) {
    //   errors.resumeLink = 'Invalid Resume link';
    // }
    if (formData.isExperienced === "") {
      errors.isExperienced = 'Please confirm whether applicant have experience or not'
    }
    if (formData.isExperienced === 'yes') {
      if (!formData.previousCompany) {
        errors.previousCompany = 'Previous company name is required';
      } else if (!/^[a-zA-Z0-9 ]+$/.test(formData.previousCompany.trim())) {
        errors.previousCompany = 'Previous company should only contain alphabets and spaces'
      }
      if (!formData.experience || formData.experience === "0") {
        errors.experience = 'Total experience is required';
      } else if (formData.experience < 0 || formData.experience > 30) {
        errors.experience = "Maximum experience is limited to 30 years"
      }
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  ///updating the state 
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  ///Adding the applicant through submit button
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (validate()) {
      console.log(formData)
      try {
        await axios.post(`${baseUrl}/applicant/add`, formData)
        try {
          dispatch(fetchApplicants())
          alert(`New Applicant ${formData.name} Added Successfully`)
          await axios.post(`${baseUrl}/add/send/${formData.name}/${formData.role}`)
          alert('Email send to Hiring Manager successfully.')
          navigate("/")
        } catch (err) {
          alert("Failed to send email.")
          setLoading(false)
          navigate("/")
        }
      } catch (err) {
        console.log(err)
        setErrors(err.response.data || {})
        alert(err.response.data.email || "Unable to add applicant now!Try after some time.")
      }
    }
    setLoading(false)
  };

  return (
    <div className='container border border-2'>
      <h4 className='text-center'>Add Applicant</h4>
      <form className="p-4 border border-2 rounded bg-light" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name of the Applicant:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
          {errors.name && <span className="text-danger">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Email of the Applicant:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
          {errors.email && <span className="text-danger">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Mobile Number:</label>
          <input type="number" name="mobile" value={formData.mobile} onChange={handleChange} className="form-control" />
          {errors.mobile && <span className="text-danger">{errors.mobile}</span>}
        </div>
        <div className="form-group">
          <label>Applied Role:</label>
          <select name="role" value={formData.role} onChange={handleChange} className="form-select">
            <option value="">---Select applied role---</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.role && <span className="text-danger">{errors.role}</span>}
        </div>
        <div className="form-group">
          <label>Select Area for Online Test:</label>
          <select name="area" value={formData.area} onChange={handleChange} className="form-select">
            <option value="">---Select Area for Online Test---</option>
            {area.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          {errors.area && <span className="text-danger">{errors.area}</span>}
        </div>
        <div className="form-group">
          <label>College Name :</label>
          <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} className="form-control" />
          {errors.collegeName && <span className="text-danger">{errors.collegeName}</span>}
        </div>
        <div className="form-group">
          <label>Highest Qualification:</label>
          <select name="qualification" value={formData.qualification} onChange={handleChange} className="form-select">
            <option value="">---Select Highest Qualification---</option>
            {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
          {errors.qualification && <span className="text-danger">{errors.qualification}</span>}
        </div>
        <div className="form-group">
          <label>Branch:</label>
          <select name="branch" value={formData.branch} onChange={handleChange} className="form-select">
            <option value="">---Select branch---</option>
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          {errors.branch && <span className="text-danger">{errors.branch}</span>}

        </div>
        <div className="form-group">
          <label>Passout Year:</label>
          <input type="number" name="passout" value={formData.passout} onChange={handleChange} className="form-control" />
          {errors.passout && <span className="text-danger">{errors.passout}</span>}
        </div>
        <div className="form-group">
          <label>Resume Link (Google Drive):</label>
          <input type="url" name="resumeLink" value={formData.resumeLink} onChange={handleChange} className="form-control" placeholder='Example:https://drive.google.com/file/d/1JH-NlcdTPpGWHBb6c0SeKAz4Ic3KDrHM/view?usp=sharing' />
          {errors.resumeLink && <span className="text-danger">{errors.resumeLink}</span>}
        </div>
        <div className="form-group">
          <label>Applicant have experience?</label>
          <div className='d-flex'>
            <div className="form-check mr-4">
              <input type="radio" name="isExperienced" value="yes" checked={formData.isExperienced === 'yes'} onChange={handleChange} className="form-check-input" />
              <label className="form-check-label">Yes</label>
            </div>
            <div className="form-check">
              <input type="radio" name="isExperienced" value="no" checked={formData.isExperienced === 'no'} onChange={handleChange} className="form-check-input" />
              <label className="form-check-label">No</label>
            </div>
          </div>
          {
            errors.isExperienced && <span className='text-danger'>{errors.isExperienced}</span>
          }
        </div>

        {formData.isExperienced === 'yes' && (
          <>
            <div className="form-group">
              <label>Total experience(in years):</label>
              <input type="number" name="experience" value={formData.experience > 0 && formData.experience} onChange={handleChange} className="form-control" />
              {
                errors.experience && <span className='text-danger'>{errors.experience}</span>
              }
            </div>
            <div className="form-group">
              <label>Previous Company:</label>
              <input type="text" name="previousCompany" value={formData.previousCompany} onChange={handleChange} className="form-control" />
              {
                errors.previousCompany && <span className='text-danger'>{errors.previousCompany}</span>
              }
            </div>
          </>
        )}
        {
          loading ? <button className="btn btn-info" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Adding Applicant... </button>
            : <button type="submit" className="btn btn-primary" disabled={loading}>Add Applicant</button>
        }
      </form>
    </div>

  );
};

export default AddApplicant;



