import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchApplicants } from '../Redux/applicantSlice'
// import Footer from './Footer'
import App from './TableComponents/App'
// import ApplicantsTable from './ApplicantComponents/ApplicantsTable'
const Homepage = () => {
  const dispatch = useDispatch()
  const status = useSelector(state => state.applicantList.status)
  const ApplicantData = useSelector(state => state.applicantList.ApplicantsList)
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchApplicants())
    }
  }, [dispatch, status, ApplicantData])
  return (
    <div>
      <div>
        <h4 className='text-center p-4'>Welcome to Applicant Tracking System</h4>
      </div>
      {
        status === "loading" ? <div className='text-center'>Applicants data is loading...</div> : <>
          {
            status === "success" ? <>{ApplicantData && ApplicantData.length > 0 ? <div style={{ overflow: "auto" }} className='container'>
              <App ApplicantData={ApplicantData} />
            </div> : <div style={{ minHeight: "80vh" }} className='text-center'>Applicants list is empty.Please
              add applicants.</div>}</> : null
          }
        </>
      }

      {/* <div>
        <Footer />
      </div> */}
    </div>
  )
}
export default Homepage