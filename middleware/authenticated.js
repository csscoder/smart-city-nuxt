import axiosInstance from '@/api/axiosInstance'

export default function ({ store, redirect }) {
  // If the user is not authenticated
  axiosInstance.get('user/tokenAccessEnabled').then((response)=>{
    if(!response.data) {
      return redirect('/login')
    }
  }).catch(() => {
    return redirect('/login')
  })
}
