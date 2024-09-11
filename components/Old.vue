<template>
    <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div class="relative py-3 sm:max-w-xl sm:mx-auto">
        <div class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div class="max-w-md mx-auto">
            <div>
              <h1 class="text-2xl font-semibold text-center">My Itinerary</h1>
            </div>
            <div class="divide-y divide-gray-200">
              <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <form @submit.prevent="addItem" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Activity</label>
                    <input v-model="newItem.activity" type="text" required class="mt-1 sm:p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Location</label>
                    <input v-model="newItem.location" type="text" required class="mt-1 sm:p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Date</label>
                    <input v-model="newItem.date" type="date" required class="mt-1 sm:p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Time</label>
                    <input v-model="newItem.time" type="time" required class="mt-1 sm:p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add to Itinerary
                  </button>
                </form>
              </div>
              <div class="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <h2 class="text-xl mb-4">Your Itinerary</h2>
                <ul class="space-y-4">
                  <li v-for="(item, index) in itinerary" :key="index" class="bg-gray-50 rounded-lg p-4 shadow">
                    <div class="flex justify-between items-start">
                      <div>
                        <h3 class="font-semibold text-lg">{{ item.activity }}</h3>
                        <p class="text-gray-600">{{ item.location }}</p>
                        <p class="text-sm text-gray-500">{{ formatDate(item.date) }} at {{ item.time }}</p>
                      </div>
                      <button @click="removeItem(index)" class="text-red-600 hover:text-red-800">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useToast } from 'vue-toastification'
  const toast = useToast()
  const itinerary = ref([])
  const newItem = ref({
    activity: '',
    location: '',
    date: '',
    time: ''
  })
  
  const addItem = () => {
    if (newItem.value.activity && newItem.value.location && newItem.value.date && newItem.value.time) {
      itinerary.value.push({ ...newItem.value })
      newItem.value = { activity: '', location: '', date: '', time: '' }
      saveToLocalStorage()
      toast.success("Item added successfully!")
    }
  }
  
  const removeItem = (index) => {
    itinerary.value.splice(index, 1)
    saveToLocalStorage()
    toast.error("Item deleted")
  }
  
  const saveToLocalStorage = () => {
    localStorage.setItem('itinerary', JSON.stringify(itinerary.value))
  }
  
  const loadFromLocalStorage = () => {
    const savedItinerary = localStorage.getItem('itinerary')
    if (savedItinerary) {
      itinerary.value = JSON.parse(savedItinerary)
    }
  }
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  onMounted(() => {
    loadFromLocalStorage()
  })
  
  watch(itinerary, () => {
    saveToLocalStorage()
  }, { deep: true })
  </script>