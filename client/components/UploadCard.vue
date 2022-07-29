<template>
  <div class="upload-container">
    <file-pond
      ref="pond"
      name="image-uploader"
      label-idle="Drag a File or Browse to Upload an Image"
      accepted-file-types="image/jpeg, image/png"
      :allow-multiple="false"
      :init="handleFilePondInit"
      credits="false"
      :server="imageProcessServer"
      :instant-upload="false"
      :allow-revert="false"
    />
  </div>
</template>

<script>
// Import Vue FilePond
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
/*eslint-disable */
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
/* eslint-enable */

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
)

export default {
  name: 'UploadCard',
  components: {
    FilePond
  },
  data: function () {
    return {
      /*eslint-disable */
      imageProcessServer: {
        process: (fieldName, file, metadata, load) => {
          const reader = new FileReader()
          reader.readAsBinaryString(file)
          reader.onload = () => {
            const b64Encoded = window.btoa(reader.result)
            this.$emit('runSearch', b64Encoded)
          }
        },
        load: () => {}
      }
      /* eslint-enable */
    }
  }
}
</script>

<style scoped>
.upload-container{
  margin: 25px;
  cursor: pointer;
}

</style>
<style>

.filepond--panel-root {
    background-color: white;
    padding: 10px;
    cursor: pointer;
  }

.filepond--drop-label label  {
    color: gray;
    cursor: pointer !important;
    font-family: 'Outfit';
    font-size: 1.3rem;
}
</style>
