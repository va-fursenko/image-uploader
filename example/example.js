import ImageUploader from '../src/ImageUploader.vue';

new Vue({
    el: '#root-container',

    components: {
        'image-uploader': ImageUploader
    },

    data: {
        selectedImage0: null,
        selectedImage1: null,
    }
});