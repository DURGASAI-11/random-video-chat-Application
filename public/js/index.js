import axios from 'axios'
import { adminPageCate, adminPageCoun } from './adminPageCC'
import { updateUser } from './userUpdate'
// import SimplePeer from 'simple-peer'
// import ws from 'ws'
// import Peer from 'peer'

const catSub = document.querySelector('.catSub')
const couSub = document.querySelector('.couSub')
const userSelectionOneTime = document.querySelector('.userSelectionOneTime')

if (catSub)
  catSub.addEventListener('submit', (e) => {
    e.preventDefault()
    const category = document.getElementById('cate').value
    adminPageCate(category)
  })

if (couSub)
  couSub.addEventListener('submit', (e) => {
    e.preventDefault()
    const country = document.getElementById('coun').value
    adminPageCoun(country)
  })

if (userSelectionOneTime)
  userSelectionOneTime.addEventListener('click', (e) => {
    e.preventDefault()
    const { userId } = e.target.dataset
    console.log('hii')
    console.log(document.getElementById('categorySelect'))
    const categorySelect = document.getElementById('categorySelect').value
    const countrySelect = document.getElementById('countrySelect').value
    updateUser(userId, categorySelect, countrySelect)
  })
