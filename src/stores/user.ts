import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    id: null,
    username: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    avatar: '',
    role: '',
  })

  const isLoggedIn = ref(false)
  const token = ref('')

  // Initialize token and user data from localStorage
  const initToken = () => {
    const storedToken = localStorage.getItem('authToken')
    const storedUserData = localStorage.getItem('userData')
    if (storedToken) {
      token.value = storedToken
      isLoggedIn.value = true
      if (storedUserData) {
        try {
          user.value = { ...JSON.parse(storedUserData) }
        } catch (error) {
          console.error('Error parsing stored user data:', error)
        }
      }
    }
  }

  // Call init on store creation
  initToken()

  const setUser = (userData) => {
    user.value = { ...userData }
    isLoggedIn.value = true
    // Store user data in localStorage
    localStorage.setItem('userData', JSON.stringify(userData))
  }

  const setToken = (authToken) => {
    token.value = authToken
    localStorage.setItem('authToken', authToken)
  }

  const logout = () => {
    user.value = {
      id: null,
      username: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      avatar: '',
      role: '',
    }
    isLoggedIn.value = false
    token.value = ''
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userData')
  }

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  return {
    user,
    isLoggedIn,
    token,
    setUser,
    setToken,
    logout,
    fetchUserData,
  }
})