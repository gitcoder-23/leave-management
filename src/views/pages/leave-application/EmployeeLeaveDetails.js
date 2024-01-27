/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { DateTime } from 'luxon'
import DataTable from 'react-data-table-component'
import htmlToFormattedText from 'html-to-formatted-text'
import ReactTooltip from 'react-tooltip'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CSpinner,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormControl,
  CTooltip,
} from '@coreui/react'
import Switch from 'react-switch'
import API from '../../../api'
import { ViewIcon, EditIcon, ChatIcon } from '../../../constant/icons'
import Chat from './Chat'
import { useDispatch } from 'react-redux'
import { getChats } from 'src/store/actions/chatActions'

const EmployeeLeaveDetails = (props) => {
  const dispatch = useDispatch()
  // role based auth start
  if (localStorage.getItem('lMuserDataToken') !== null) {
    const userData = JSON.parse(localStorage.getItem('lMuserDataToken'))
    if (userData.user_role === 'employee') {
      if (props) {
        // eslint-disable-next-line react/prop-types
        props.history.push('/dashboard')
      }
    }
  }
  // role based auth end

  const [visible, setVisible] = useState(false)
  const [openChat, toggleChat] = useState(false)
  const [chatData, setChatData] = useState([
    {
      display_name: '',
      date: '',
      chat: '',
    },
  ])
  const [editVisible, setEditVisible] = useState(false)
  const [singleLeave, setSingleLeave] = useState([
    {
      dept_name: '',
      display_name: '',
      end_date: '',
      reason: '',
      start_date: '',
      status: '',
    },
  ])
  const [approveChecked, setApproveChecked] = useState(false)
  const [rejectChecked, setRejectChecked] = useState(false)

  // Search
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('display_name', 'dept_name')

  const [posts, setPosts] = useState('')
  const [editvalue, setEditvalues] = useState({})
  const switchClasses = (type) => {
    switch (type) {
      case 0:
        return 'btn btn-warning'
      case 1:
        return 'btn btn-success'
      case 2:
        return 'btn btn-danger'
      case 3:
        return 'btn btn-light'
      case 4:
        return 'btn btn-secondary'
      case 5:
        return 'btn btn-dark'
      default:
        break
    }
  }

  const StatusCell = ({ row }) => (
    <p className={'Status-cell' + ' ' + switchClasses(row?.status * 1)}>
      {/* convert string to integer * 1 or parseInt */}
      {row?.status * 1 === 0 && 'Pending'}
      {row?.status * 1 === 1 && 'Approved'}
      {row?.status * 1 === 2 && 'Rejected'}
      {row?.status * 1 === 3 && 'On Hold'}
      {row?.status * 1 === 4 && 'Modified'}
      {row?.status * 1 === 5 && 'Cancelled'}
    </p>
  )

  const StartDate = ({ row }) => DateTime.fromISO(row.start_date).toFormat('dd-MM-yyyy')
  const EndDate = ({ row }) => DateTime.fromISO(row.end_date).toFormat('dd-MM-yyyy')

  const columns = [
    {
      name: 'Sl. No.',
      selector: 'slNo',
      sortable: true,
      maxWidth: '1px',
    },
    // {
    //   name: 'Id',
    //   selector: 'id',
    //   sortable: true,
    //   maxWidth: '1px',
    // },
    {
      name: 'Employee Name',
      selector: 'display_name',
      sortable: true,
    },
    {
      name: 'Department',
      selector: 'dept_name',
      sortable: true,
      maxWidth: '150px',
    },
    {
      name: 'Start Date',
      selector: 'start_date',
      // eslint-disable-next-line react/display-name
      cell: (SdRow) => <StartDate row={SdRow} />,
      sortable: true,
      maxWidth: '150px',
    },
    {
      name: 'End Date',
      selector: 'end_date',
      // eslint-disable-next-line react/display-name
      cell: (EdRow) => <EndDate row={EdRow} />,
      sortable: true,
      maxWidth: '150px',
    },
    {
      name: 'Status',
      selector: 'status',
      // eslint-disable-next-line react/display-name
      cell: (row) => <StatusCell row={row} />,
      sortable: true,
      maxWidth: '150px',
    },
    {
      name: 'View/ Edit',
      // eslint-disable-next-line react/display-name
      cell: (row) => <ViewEditTag row={row} />,
    },
    {
      name: 'Action',
      // eslint-disable-next-line react/display-name
      cell: (row) => <ActionTag row={row} />,
    },
  ]

  const ActionTag = ({ row }) => {
    // eslint-disable-next-line no-unused-expressions
    return (
      <>
        {row.status === '0' && (
          <>
            <ReactTooltip id="pendingTip1" type="info">
              <span>Approve Leave</span>
            </ReactTooltip>
            <Link data-tip data-for="pendingTip1">
              <Switch
                height={20}
                width={48}
                onChange={(e) => handleApproveChange(e, row.id)}
                checked={row.status === '1' ? true : false}
                className="react-switch"
              />
            </Link>
            &nbsp;&nbsp;
            <ReactTooltip id="pendingTip2" type="info">
              <span>Reject Leave</span>
            </ReactTooltip>
            <Link data-tip data-for="pendingTip2">
              <Switch
                onColor="#e55353"
                height={20}
                width={48}
                onChange={(e) => handleRejectChange(e, row.id)}
                checked={row.status === '2' ? true : false}
                className="react-switch custom-switch-class"
              />
            </Link>
          </>
        )}

        {row.status === '1' && (
          <>
            <ReactTooltip id="approveTip1" type="info">
              <span>Leave Approved</span>
            </ReactTooltip>
            <Link data-tip data-for="approveTip1">
              <Switch
                height={20}
                width={48}
                onChange={(e) => handleApproveChange(e, row.id)}
                checked={row.status === '1' ? true : false}
                className="react-switch"
              />
            </Link>
            &nbsp;&nbsp;
            <ReactTooltip id="approveTip2" type="info">
              <span>Not Applicable</span>
            </ReactTooltip>
            <Link data-tip data-for="approveTip2">
              <Switch
                onColor="#e55353"
                height={20}
                width={48}
                onChange={(e) => handleRejectChange(e, row.id)}
                checked={row.status === '2' ? true : false}
                className="react-switch custom-switch-class"
                disabled
              />
            </Link>
          </>
        )}

        {row.status === '2' && (
          <>
            <ReactTooltip id="rejectTip1" type="info">
              <span>Not Applicable</span>
            </ReactTooltip>
            <Link data-tip data-for="rejectTip1">
              <Switch
                height={20}
                width={48}
                onChange={(e) => handleApproveChange(e, row.id)}
                checked={row.status === '1' ? true : false}
                className="react-switch"
                disabled
              />
            </Link>
            &nbsp;&nbsp;
            <ReactTooltip id="rejectTip2" type="info">
              <span>Leave Rejected</span>
            </ReactTooltip>
            <Link data-tip data-for="rejectTip2">
              <Switch
                onColor="#e55353"
                height={20}
                width={48}
                onChange={(e) => handleRejectChange(e, row.id)}
                checked={row.status === '2' ? true : false}
                className="react-switch custom-switch-class"
              />
            </Link>
          </>
        )}

        {row.status === '3' && (
          <>
            <ReactTooltip id="onHoldTip1" type="info">
              <span>Leave Approve</span>
            </ReactTooltip>
            <Link data-tip data-for="onHoldTip1">
              <Switch
                height={20}
                width={48}
                onChange={(e) => handleApproveChange(e, row.id)}
                checked={row.status === '1' ? true : false}
                className="react-switch"
              />
            </Link>
            &nbsp;&nbsp;
            <ReactTooltip id="onHoldTip2" type="info">
              <span>Leave Reject</span>
            </ReactTooltip>
            <Link data-tip data-for="onHoldTip2">
              <Switch
                onColor="#e55353"
                height={20}
                width={48}
                onChange={(e) => handleRejectChange(e, row.id)}
                checked={row.status === '2' ? true : false}
                className="react-switch custom-switch-class"
              />
            </Link>
          </>
        )}

        {row.status === '4' && (
          <>
            <ReactTooltip id="modifiedTip1" type="info">
              <span>Leave Approve</span>
            </ReactTooltip>
            <Link data-tip data-for="modifiedTip1">
              <Switch
                height={20}
                width={48}
                onChange={(e) => handleApproveChange(e, row.id)}
                checked={row.status === '1' ? true : false}
                className="react-switch"
              />
            </Link>
            &nbsp;&nbsp;
            <ReactTooltip id="modifiedTip2" type="info">
              <span>Leave Reject</span>
            </ReactTooltip>
            <Link data-tip data-for="modifiedTip2">
              <Switch
                onColor="#e55353"
                height={20}
                width={48}
                onChange={(e) => handleRejectChange(e, row.id)}
                checked={row.status === '2' ? true : false}
                className="react-switch custom-switch-class"
              />
            </Link>
          </>
        )}

        {row.status === '5' && (
          <>
            <ReactTooltip id="cancelTip1" type="info">
              <span>Not Applicable</span>
            </ReactTooltip>
            <Link data-tip data-for="cancelTip1">
              <Switch
                height={20}
                width={48}
                onChange={(e) => handleApproveChange(e, row.id)}
                checked={row.status === '1' ? true : false}
                className="react-switch"
                disabled
              />
            </Link>
            &nbsp;&nbsp;
            <ReactTooltip id="cancelTip2" type="info">
              <span>Not Applicable</span>
            </ReactTooltip>
            <Link data-tip data-for="cancelTip2">
              <Switch
                onColor="#e55353"
                height={20}
                width={48}
                onChange={(e) => handleRejectChange(e, row.id)}
                checked={row.status === '2' ? true : false}
                className="react-switch custom-switch-class"
                disabled
              />
            </Link>
          </>
        )}
      </>
    )
  }

  const ViewEditTag = ({ row }) => {
    return (
      <>
        <CButton
          color="info"
          shape="round"
          className="custom-btn"
          onClick={() => viewDetail(row.id)}
        >
          <ViewIcon />
        </CButton>
        &nbsp;&nbsp;
        {row.status === '1' || row.status === '2' || row.status === '5' ? (
          <>
            <CButton
              height={20}
              width={48}
              color="success"
              shape="round"
              className="custom-btn"
              onClick={() => editLeave(row)}
              disabled
            >
              <EditIcon />
            </CButton>
          </>
        ) : (
          <>
            <CButton
              height={20}
              width={48}
              color="success"
              shape="round"
              className="custom-btn"
              onClick={() => editLeave(row)}
            >
              <EditIcon />
            </CButton>
          </>
        )}
        &nbsp;
        <CButton
          style={{ backgroundColor: '#2db67c' }}
          shape="round"
          className="custom-btn"
          onClick={() => viewChat(row.id)}
        >
          <ChatIcon />
        </CButton>
      </>
    )
  }

  const leaveApprove = (id) => {
    API.post(`/wp-jwt/v1/leave-appication-approve/${id}`)
      .then((res) => {
        getData()
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const handleApproveChange = (val, id) => {
    leaveApprove(id)
    setApproveChecked(val)
  }

  const leaveReject = (id) => {
    API.post(`/wp-jwt/v1/leave-application-rejected/${id}`)
      .then((res) => {
        getData()
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const handleRejectChange = (val, id) => {
    leaveReject(id)
    setRejectChecked(val)
  }

  //  search ops here
  const getSearch = (e) => {
    e.preventDefault()
    setQuery(search)
    // to reset after search button click
    setSearch('')
  }

  const updateSearch = (evt) => {
    setSearch(evt.target.value)
    console.log(evt.target.value)
    if (evt.target.value === '') {
      setPosts(posts)
    } else {
      const afterFilteredData = posts.filter((obj) => {
        // if (evt.target.value === '') {
        //   return obj
        // } else if (obj.display_name.toLowerCase().includes(evt.target.value.toLowerCase())) {
        //   return obj
        // } else if (obj.dept_name.toLowerCase().includes(evt.target.value.toLowerCase())) {
        //   return obj
        // } else {
        //   return obj
        // }
        // console.log(obj)

        return obj.dept_name.toLowerCase().includes(evt.target.value.toLowerCase())
      })

      console.log('afterFilteredData', afterFilteredData)
      setPosts(afterFilteredData)
    }
  }

  const getData = () => {
    API.get('/wp-jwt/v1/applied-leave-details')
      .then((res) => {
        // console.log('getData', res)
        const getAppliedLeaves = res.data.data.reverse()
        const filteredData = getAppliedLeaves.filter((searchVal) => {
          console.log('searchVal', searchVal)
          // searchVal.display_name &&
          //   searchVal.display_name.toLowerCase().includes(search.toLowerCase())
          // return searchVal
          if (search === '') {
            return searchVal
          } else if (searchVal.display_name.toLowerCase().includes(search.toLowerCase())) {
            return searchVal
          } else if (searchVal.dept_name.toLowerCase().includes(search.toLowerCase())) {
            return searchVal
          } else if (searchVal.search) {
            return searchVal
          }
        })
        const margeData = filteredData.map((m, i) => {
          // console.log('margeData', m)
          return { ...m, ...{ slNo: i + 1 } }
        })

        setPosts(margeData)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //  View
  const viewDetail = (id) => {
    setVisible(!visible)
    console.log(id)
    singleData(id)
  }

  const viewModalClose = () => {
    setVisible(false)
    setSingleLeave([
      {
        dept_name: '',
        display_name: '',
        end_date: '',
        reason: '',
        start_date: '',
        status: '',
      },
    ])
  }

  // Chat
  const viewChat = (id) => {
    console.log('viewChat-id=>', id)
    singleData(id)
    sessionStorage.setItem('singleChat', id)
    getChat(id)
    toggleChat(true)
  }

  const getChat = (id) => {
    dispatch(getChats(id))
    // API.get(`/wp-jwt/v1/get-comment/${id}`)
    //   .then((response) => {
    //     console.log('getChat', response.data.data)
    //     setChatData(response.data.data)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
  }

  const closeChat = () => {
    toggleChat(false)
    // after close modal pass blank string
    setChatData([
      {
        display_name: '',
        date: '',
        chat: '',
      },
    ])
  }

  // this is for edit & view get data
  const singleData = (id) => {
    API.get(`/wp-jwt/v1/applied-leave-details/${id}`)
      .then((res) => {
        console.log('singleData', res.data)
        setSingleLeave(res.data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // Edit
  const editSubmit = (e) => {
    e.preventDefault()
    saveEdit({
      leave_edit_date: {
        start_date: DateTime.fromISO(editvalue.start_date).toFormat('yyyy-MM-dd'),
        end_date: DateTime.fromISO(editvalue.end_date).toFormat('yyyy-MM-dd'),
      },
      leave_edit: {
        id: editvalue.id,
      },
    })
  }

  const saveEdit = (editData) => {
    API.post(`/wp-jwt/v1/date-edit/${editData.leave_edit.id}`, editData.leave_edit_date)
      .then(() => {
        editDismiss()
        toast.success('Success! Leave modified')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const editDismiss = () => {
    setEditVisible(!editVisible)
    getData()
  }

  const editLeave = (row) => {
    setEditVisible(true)
    const modifiedData = {
      id: row.id,
      display_name: row.display_name,
      start_date: row.start_date,
      end_date: row.end_date,
      reason: row.reason,
      dept_name: row.dept_name,
    }
    setEditvalues(modifiedData)
  }

  const editModalClose = () => {
    setEditVisible(false)
  }

  useEffect(() => {
    getData()
  }, [])

  const customStyles = {
    headCells: {
      style: {
        fontWeight: '500',
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
      },
    },
  }

  return (
    <>
      <CModal name="view-modal" visible={visible} onDismiss={viewModalClose}>
        <CModalHeader onDismiss={viewModalClose}>
          <CModalTitle>View Leave Detail</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/*  any blank string pass here */}
          {singleLeave[0].display_name === '' ? (
            <div className="text-center">
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              <CRow className="row">
                <CCol className="mb-2">
                  <strong>[Employee- {singleLeave[0]?.display_name}]</strong>
                </CCol>
              </CRow>
              <CRow className="row gy-2 gx-3">
                <CCol xs>
                  <div className="mb-3">
                    <CFormLabel htmlFor="start_date">Start Date</CFormLabel>
                    <CFormControl
                      type="text"
                      value={DateTime.fromISO(singleLeave[0]?.start_date).toFormat('dd-MM-yyyy')}
                      disabled
                    />
                  </div>
                </CCol>

                <CCol xs>
                  <div className="mb-3">
                    <CFormLabel htmlFor="start_date">End Date</CFormLabel>
                    <CFormControl
                      type="text"
                      value={DateTime.fromISO(singleLeave[0]?.end_date).toFormat('dd-MM-yyyy')}
                      disabled
                    />
                  </div>
                </CCol>

                <CCol>
                  <div className="mb-3">
                    <CFormLabel htmlFor="dept_name">Department</CFormLabel>
                    <CFormControl type="text" value={singleLeave[0]?.dept_name} disabled />
                  </div>
                </CCol>
              </CRow>

              <CRow xs={{ gutterX: 6 }}>
                <CCol>
                  <div className="mb-3">
                    <CFormLabel htmlFor="reason">Reason of leave</CFormLabel>
                    <CFormControl
                      component="textarea"
                      value={htmlToFormattedText(singleLeave[0]?.reason)}
                      disabled
                    />
                  </div>
                </CCol>
              </CRow>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" style={{ color: '#fff' }} onClick={viewModalClose}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal name="edit-modal" visible={editVisible} onDismiss={editModalClose}>
        <CModalHeader onDismiss={editDismiss}>
          <CModalTitle>Edit Leave Detail</CModalTitle>
        </CModalHeader>
        <CForm id="edit" onSubmit={editSubmit}>
          <CModalBody>
            <CRow className="row">
              <CCol className="mb-2">
                <strong>Employee- {editvalue.display_name}</strong>
              </CCol>
            </CRow>
            <CRow className="row gy-2 gx-3">
              <CCol xs>
                <div className="mb-3">
                  <CFormLabel htmlFor="start_date">Start Date</CFormLabel>
                  <CFormControl
                    className="custom-date"
                    type="date"
                    value={editvalue.start_date}
                    name="start_date"
                    id="start_date"
                    onChange={(e) => setEditvalues({ ...editvalue, start_date: e.target.value })}
                  />
                </div>
              </CCol>

              <CCol xs>
                <div className="mb-3">
                  <CFormLabel htmlFor="end_date">End Date</CFormLabel>
                  <CFormControl
                    className="custom-date"
                    type="date"
                    value={editvalue.end_date}
                    name="end_date"
                    id="end_date"
                    onChange={(e) => setEditvalues({ ...editvalue, end_date: e.target.value })}
                  />
                </div>
              </CCol>

              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="dept_name">Department</CFormLabel>
                  <CFormControl type="text" value={editvalue.dept_name} disabled />
                </div>
              </CCol>
            </CRow>
            <CRow xs={{ gutterX: 6 }}>
              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="reason">Reason of leave</CFormLabel>
                  <CFormControl
                    component="textarea"
                    value={htmlToFormattedText(editvalue.reason)}
                    disabled
                  />
                </div>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="danger" style={{ color: '#fff' }} onClick={editModalClose}>
              Close
            </CButton>
            <CButton type="submit" color="primary">
              Save
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CContainer className="overflow-hidden">
        <CRow xs={{ gutterY: 5 }}>
          <CCol xs={{ span: 12 }}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Leave Application Details</strong>
              </CCardHeader>
              <CCardBody className="custom-class">
                <CRow xs={{ gutterX: 6 }}>
                  <CCol>
                    <div className="mb-3">
                      <CFormLabel></CFormLabel>
                    </div>
                  </CCol>
                  <CCol>
                    <div className="mb-3">
                      <CForm className="search-form" onSubmit={getSearch}>
                        <CFormControl
                          className="form-control me-sm-2"
                          placeholder="Search by name/ department"
                          style={{
                            height: '35px',
                            display: 'initial',
                            padding: '0 5px',
                            width: '70%',
                            fontSize: '14px',
                          }}
                          type="text"
                          value={search}
                          onChange={updateSearch}
                        />
                        <CButton
                          className="btn btn-primary my-2 my-sm-0"
                          style={{
                            height: '35px',
                            padding: '0 5px',
                            width: '20%',
                          }}
                          type="submit"
                        >
                          Reset
                        </CButton>
                      </CForm>
                    </div>
                  </CCol>
                </CRow>
                {!posts ? (
                  <CSpinner color="primary" />
                ) : (
                  <>
                    {posts.length === 0 ? (
                      <h3 className="d-flex justify-content-center">No leave found!</h3>
                    ) : (
                      <>
                        <DataTable
                          columns={columns}
                          data={posts}
                          pagination
                          paginationPerPage={5}
                          paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                          customStyles={customStyles}
                        />
                      </>
                    )}
                  </>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      {/* Chat ui */}
      {openChat && <Chat close={closeChat} openChat={openChat} chatData={chatData} />}
      <style>{customCss}</style>
    </>
  )
}

export default EmployeeLeaveDetails

const customCss = `
  .custom-class .sc-fnVZcZ.cDmETx.rdt_TableHeader {
    display: none;
  }
  .custom-btn .custom_icon {
    color: #ffffffd1;
  }
  button.btn.round.custom-btn,
    button.btn.btn-success.round.custom-btn{
    border-radius: 50px;
    height: 40px;
  }
  .custom-date {
    width: 160px;
  }
  .Status-cell {
    margin-top: 8px;
    margin-bottom: 8px;
    padding: 5px 0px;
    max-width: 100px;
    width: 100%;
  }

  .react-switch {
    // vertical-align: middle;
    // margin-left: 4px;
  }

  // .custom-switch-class .react-switch-bg {
  //   background-color: rgb(214 26 78) !important;
  // }
`
