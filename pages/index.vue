<template>
  <div class='my-10 container mx-auto px-10'>
    <a-spin tip='Loading...' :spinning='!devices'>
      <a-carousel ref='slider' v-if='devices' :after-change='onChange'>
        <div v-for='item in devices'>
          <div class='h-40 bg-blue-800 flex justify-center items-center'>
            <div class='text-white text-lg transition  font-bold hover:text-yellow-300 cursor-pointer'>{{ item.name }}
            </div>
          </div>
        </div>
      </a-carousel>

      <div class='w-full'>
        <a-spin tip='Loading device info...' :spinning='!deviceInfo'>
          <div class='w-full py-10'>
            <div v-if='deviceInfo'>
              <a-descriptions bordered title='Device info'>
                <a-descriptions-item label='Name'>
                  {{ deviceInfo.name }}
                </a-descriptions-item>
                <a-descriptions-item label='Description'>
                  <span
                    v-if='deviceInfo.additionalInfo && deviceInfo.additionalInfo.description'>{{ deviceInfo.additionalInfo.description
                    }}</span>
                  <span v-else>No info</span>
                </a-descriptions-item>
                <a-descriptions-item label='Created'>
                  <div v-text='renderDate(deviceInfo.createdTime)'></div>
                </a-descriptions-item>
                <a-descriptions-item label='ID device'>
                  {{ deviceInfo.id.id }}
                </a-descriptions-item>
              </a-descriptions>
            </div>

          </div>
        </a-spin>
      </div>

    </a-spin>
  </div>

</template>

<script>
import axiosInstance from '@/api/axiosInstance'

export default {
  middleware: 'authenticated',
  data() {
    return {
      devices: null,
      currentSlide: null,
      deviceInfo: null
    }
  },
  mounted() {
    console.log(this.$refs.slider)
  },
  methods: {
    renderDate(timeStamp) {
      const date = new Date(timeStamp)
      return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
    },
    moreInfo() {
      this.deviceInfo = null
      axiosInstance.get('devices', {
        params: {
          deviceIds: this.selectedDeviceID
        }
      }).then((response) => {
        this.deviceInfo = response.data[0]
      })
    },
    onChange(current) {
      this.currentSlide = current
      this.moreInfo()
    }
  },
  computed: {
    selectedDeviceID() {
      return this.devices[this.currentSlide].id.id
    }
  },
  watch: {
    devices(oldValue, newValue) {
      this.currentSlide = 0
      this.moreInfo()
    }
  },
  async fetch() {
    await axiosInstance.get('tenant/deviceInfos', {
      params: {
        pageSize: 100,
        page: 0
      }
    }).then((response) => {
      console.log(response)
      this.devices = response.data.data
    })
  }
}
</script>
