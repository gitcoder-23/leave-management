/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react'

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
  CCreateNavItem,
} from '@coreui/react'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const [slideOpen, setSlideOpen] = useState(false)

  // sidebar Block by user Role start
  let navArray = navigation
  let result = []
  if (localStorage.getItem('lMuserDataToken') !== null) {
    const userData = JSON.parse(localStorage.getItem('lMuserDataToken'))
    if (userData.user_role === 'project_manager') {
      result = navArray.map((arrayValue) => {
        arrayValue = Object.assign({}, arrayValue)
        if (arrayValue.items) {
          arrayValue.items = arrayValue.items.filter(
            (anchorName) =>
              anchorName.anchor !== 'Apply Leave' && anchorName.anchor !== 'My Details',
          )
          return arrayValue
        } else {
          return arrayValue
        }
      })
    } else if (userData.user_role === 'employee') {
      result = navArray.map((arrayValue) => {
        arrayValue = Object.assign({}, arrayValue)
        if (arrayValue.items) {
          arrayValue.items = arrayValue.items.filter(
            (anchorName) => anchorName.anchor !== 'Employee Leave',
          )
          return arrayValue
        } else {
          return arrayValue
        }
      })
    } else {
      result = navArray
    }
  }
  // console.log(navigation)
  // sidebar Block by user Role end
  return (
    <>
      <CSidebar position="fixed" selfHiding="md">
        <CSidebarBrand className="d-none d-md-flex" to="/">
          <p>
            &nbsp;&nbsp;
            <img src="/logo.png" width="10%" /> Leave Management System
          </p>
        </CSidebarBrand>
        <CSidebarNav>
          <SimpleBar>
            <CCreateNavItem items={result} />
          </SimpleBar>
        </CSidebarNav>
        <CSidebarToggler className="d-none d-lg-flex" onClick={() => setSlideOpen(false)} />
      </CSidebar>
    </>
  )
}

export default React.memo(AppSidebar)
