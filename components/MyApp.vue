<template>
  <div class="min-h-screen bg-gradient-to-b mx-auto max-w-sm from-blue-100 to-blue-200 flex flex-col px-4 py-6">
    <header class="text-center mb-4">
      <h1 class="text-3xl font-bold text-blue-800">My Itinerary</h1>
    </header>

    <!-- Itinerary List -->
    <div class="space-y-4 mb-16" v-if="itinerary.length > 0">
      <div v-for="(item, index) in itinerary" :key="index" class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors duration-200" @click="openDetailsModal(index)">
        <div>
          <h3 class="font-semibold text-lg text-blue-700">{{ item.activity }}</h3>
          <p class="text-sm text-gray-600">{{ formatDate(item.date) }} - {{ item.time }}</p>
          <!-- <p class="text-sm text-gray-600">{{ item.description }}</p> -->
        </div>
        <button @click.stop="removeItem(index)" class="text-red-500 hover:text-red-700 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
    <div class="space-y-4 mb-16" v-else>
      <div class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors duration-200" @click="openDetailsModal(index)">
        <div>
          <h3 class="font-semibold text-lg text-blue-700">No itinerary added</h3>
        </div>
      </div>
    </div>

    <!-- Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white shadow-lg py-3 px-4 flex justify-center">
      <button @click="openAddModal" class="bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </nav>

    <!-- Add Itinerary Modal -->
    <Transition name="slide-up">
      <div v-if="showAddModal" class="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-lg w-full max-w-md mx-auto max-w-mdd" style="height: 70vh;">
        <div class="p-6 relative h-full overflow-y-auto">
          <button @click="closeAddModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 class="text-2xl font-bold mb-4 text-blue-800">Add New Itinerary</h2>
          <form @submit.prevent="addItem">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Activity</label>
              <input v-model="newItem.activity" type="text" required class="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Location</label>
              <input v-model="newItem.location" type="text" required class="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Date</label>
              <input v-model="newItem.date" type="date" required class="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Time</label>
              <input v-model="newItem.time" type="time" required class="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="newItem.description" required class="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline"></textarea>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
              Add Itinerary
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Itinerary Details Modal -->
    <Transition name="slide-up">
      <div v-if="showDetailsModal" class="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-lg w-full max-w-md mx-auto max-w-mdd" style="height: 50vh">
        <div class="p-6 relative h-full overflow-y-auto">
          <button @click="closeDetailsModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 class="text-2xl font-bold mb-4 text-blue-800">{{ selectedItinerary.activity }}</h2>
          <p class="mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a10 10 0 110 20 10 10 0 010-20z" />
            </svg>
            {{ selectedItinerary.location }}
          </p>
          <p class="mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v10m8-10v10m-4-4h.01" />
            </svg>
            {{ formatDate(selectedItinerary.date) }} - {{ selectedItinerary.time }}
          </p>
          <p class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
            </svg>
            {{ selectedItinerary.description }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const itinerary = ref([])
const newItem = ref({ activity: '', location: '', date: '', time: '', description: ''  })
const showAddModal = ref(false)
const showDetailsModal = ref(false)
const selectedItinerary = ref({})
const toast = useToast()

const openAddModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const openDetailsModal = (index) => {
  selectedItinerary.value = itinerary.value[index]
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
}

const addItem = () => {
  if (newItem.value.activity && newItem.value.location && newItem.value.date && newItem.value.time) {
    itinerary.value.push({ ...newItem.value })
    newItem.value = { activity: '', location: '', date: '', time: '', description: '' }
    saveToLocalStorage()
    closeAddModal()
    toast.success("Itinerary added successfully!")
  }
}

const removeItem = (index) => {
  itinerary.value.splice(index, 1)
  saveToLocalStorage()
  toast.error("Item removed")
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

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Ensure mobile-first design */
.max-w-mdd {
    width: 400px ;
  }
  @media (max-width: 578px) {
  .max-w-mdd {
    width: 100% ;
  }
}
@media (min-width: 640px) {
  .max-w-md {
    max-width: 28rem !important;
  }
}
</style>