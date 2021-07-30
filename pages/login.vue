<template>
  <div>
    <a-layout>
      <a-layout-content>
        <div class='min-h-screen flex flex-col justify-center items-center'>
          <div class='w-full max-w-md'>

            <a-form :form='form' @submit='handleSubmit'>
              <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
                <a-input
                  v-decorator="[
          'username',
          { rules: [{ required: true, message: 'Please input your user name!' }] },
        ]"
                  placeholder='User name'
                >
                  <a-icon slot='prefix' type='user' style='color:rgba(0,0,0,.25)' />
                </a-input>
              </a-form-item>
              <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
                <a-input
                  v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] },
        ]"
                  type='password'
                  placeholder='Password'
                >
                  <a-icon slot='prefix' type='lock' style='color:rgba(0,0,0,.25)' />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button type='primary' html-type='submit' :disabled='hasErrors(form.getFieldsError())'>
                  Log in
                </a-button>
              </a-form-item>
            </a-form>
            <div>
              Tested: <br>
              tenant@thingsboard.org / tenant
            </div>
          </div>


        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

import axiosInstance from '@/api/axiosInstance'
import { setItem } from '@/helpers/pStorage'

export default {
  data() {
    return {
      hasErrors,
      form: this.$form.createForm(this, { name: 'horizontal_login' })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.form.validateFields()
    })
  },
  methods: {
    // Only show error after a field is touched.
    userNameError() {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('userName') && getFieldError('userName')
    },
    // Only show error after a field is touched.
    passwordError() {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('password') && getFieldError('password')
    },
    handleSubmit(e) {
      const vm = this
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          axiosInstance.post('auth/login', values)
            .then(function(response) {
              setItem('accessToken', response.data.token)
              vm.$router.push('/')
            })
            .catch(function(error) {
              console.log(error)
            })

        }
      })
    }
  }
}
</script>
