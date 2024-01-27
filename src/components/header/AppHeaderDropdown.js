/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import Avatar from 'react-avatar'
import {
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import Accounts from './account/Accounts'
const AppHeaderDropdown = () => {
  const [user, setUser] = useState({})

  const makeLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem('lMuserDataToken')
    sessionStorage.removeItem('singleChat')
    toast.warn('Success! Logout Successfully')
    window.location.reload()
  }
  // Data show after login
  useEffect(() => {
    const loggedInUser = localStorage.getItem('lMuserDataToken')
    // console.log('loggedInUser', loggedInUser)
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser)
      // console.log('foundUser', foundUser)
      setUser(foundUser)
    }
  }, [])
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        {/* <CAvatar src="avatars/8.jpg" size="md" /> */}
        <Avatar className="mr-2" name={user && user.user_nicename} size="45" round={true} />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {/* <Accounts /> */}

        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
        <CDropdownItem href="/profile">
          <CIcon name="cil-user" className="me-2" />
          Profile
        </CDropdownItem>
        {/* 
        <CDropdownItem href="/settings">
          <CIcon name="cil-settings" className="me-2" />
          Settings
        </CDropdownItem>        
        <CDropdownItem href="#">
          <CIcon name="cil-credit-card" className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon name="cil-file" className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
         */}
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={(e) => makeLogout(e)}>
          <CIcon content={freeSet.cilPowerStandby} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
