<template>
    <div ref="mainContainer" class="image-uploader">
        <div class="image-uploader__input-wrapper">
            <i class="fa fa-plus fa-2x" aria-hidden="true"></i>
            <input type="file" class="image-uploader__input" @change="previewThumbnail" :id="id" :name="id" accept="image/*">
        </div>

        <div class="image-uploader__image-wrapper">
            <i v-show="isEmpty && !isLoading" class="fa fa-picture-o fa-3x"></i>
            <i v-show="isLoading" class="fa fa-refresh fa-spin fa-3x"></i>
            <img
                    v-show="!isEmpty && !isLoading"
                    class="image-uploader__image"
                    ref="img"
                    :src="src"
                    :class="{
                           'with-info': showInfo && !isEmpty,
                        'without-info': !showInfo || isEmpty
                    }"
            >

            <pre v-show="!isEmpty && showInfo && !isLoading" class="image-uploader__image-info">{{ fileInfo }}</pre>
        </div>

        <div v-show="isDragging" ref="dragNDropScreenWrapper" class="image-loader__drag-n-drop-screen-wrapper">
        </div>

        <div v-show="isDragging" ref="dragNDropWrapper" class="image-loader__drag-n-drop-wrapper">
            <div class="fa fa-picture-o image-loader__drag-n-drop-text" aria-hidden="true"></div>
        </div>

        <i v-show="(!isEmpty || isLoading) && allowClear" @click="clearValue()" class="fa fa-trash-o image-loader__clear-icon" title="Clear image"></i>
    </div>
</template>

<script lang="babel">
    import { App } from './common/app';
    import { FileHelper } from './common/file-helper';

    export default{
        // Obtained parameters
        props: {
            // Filename
            value: {
                type: String,
                default: '',
                twoWay: true
            },

            // Pictures base directory
            srcPrefix: {
                type: String,
                default: '/static/',
            },

            // Component DOM id and name
            id: {
                type: String,
                default: 'picture'
            },

            // Show file info flag
            showInfo: {
                type: Boolean,
                default: false
            },

            // Clear flag
            allowClear: {
                type: Boolean,
                default: false
            }
        },

        // Data store
        data () {
            return {
                // New uploaded image's base64-encoded content
                content: null,
                // New image's File object
                file: null,
                isLoading: false,
                isDragging: false
            }
        },

        // Computed properties
        computed: {
            /**
             * Possible component's custom events
             *
             * @return {Object}
             */
            events () {
                return {
                    IMAGE_CHANGED: 'image-changed'
                };
            },

            /**
             * Picture src
             * 
             * @return {String}
             */
            src () {
                if (this.content) {
                    return this.content;
                }
                return this.isEmpty
                        ? ''
                        : this.srcPrefix + this.value;
            },

            /** 
             * Image info - file name, size, type
             * 
             * @return {String}
             */
            fileInfo () {
                if (this.isEmpty) {
                    return '';
                }
                let result = this.value;
                if (this.file instanceof File) {
                    result += "\n." + this.file.type.split('/')[1] + "\n"
                        + FileHelper.formatSize(this.file.size);
                }
                if (this.width > 0) {
                    result += "\n" + this.width + 'x' + this.height + 'px';
                }
                return result;
            },

            /**
             * Get original picture width
             *
             * @return {Number}
             */
            width () {
                return this.$refs.img
                        ? this.$refs.img.naturalWidth
                        : 0;
            },

            /** 
             * Get original picture height
             *    
             * @return {Number}
             */
            height () {
                return this.$refs.img
                        ? this.$refs.img.naturalHeight
                        : 0;
            },

            /** 
             * Empty value flag
             *
             * @return {Boolean}
             */
            isEmpty () {
                return !Boolean(this.value);
            }
        },

        // Component's methods
        methods: {
            /**
             * Clear value and all other data properties
             */
            clearValue () {
                this.file = null;
                this.isLoading = false;
                this.isDragging = false;
                // Dispatch input events with empty value and image content
                this.dispatchInputEvents('', null);
            },

            /**
             * Load new picture
             *
             * @param event
             */
            previewThumbnail (event) {
                this.handleFiles(event.target.files)
            },

            /**
             * Handle files (Actually first only)
             *
             * @param {File[]} files
             */
            handleFiles (files) {
                if (!files || !files[0]) {
                    return;
                }
                if (!/^image\//.test(files[0].type)) {
                    return;
                }

                this.selectImage(files[0]);
            },

            /**
             * Select specified {File} image object
             *
             * @param {File} file
             */
            selectImage (file) {
                let reader = new FileReader();
                // Set new image load handler
                reader.onload = this.onImageLoad;
                this.isLoading = true;
                this.file = file;
                reader.readAsDataURL(file);
            },

            /**
             * New image load handler. Emits 'input' event
             *
             * @param {Event} e
             */
            onImageLoad (e) {
                this.content = e.target.result;
                this.isLoading = false;
                let filename = this.file instanceof File
                    ? this.file.name
                    : '';                
                // Dispatch input events with new value and image content
                this.dispatchInputEvents(filename, this.content);
            },

            /**
             * Drag-n-drop begin
             *
             * @param {Event} e
             */
            onDragEnter (e) {
                e.stopPropagation();
                e.preventDefault();
                this.isDragging = true;
            },

            /**
             * Drag-n-drop over component
             *
             * @param {Event} e
             */
            onDragOver (e) {
                e.stopPropagation();
                e.preventDefault();
            },

            /**
             * Drag over component
             *
             * @param {Event} e
             */
            onDrop (e) {
                e.stopPropagation();
                e.preventDefault();
                this.isDragging = false;
                if (e.dataTransfer.files && App.eventOnElement(e, this.$refs.mainContainer)) {
                    this.handleFiles(e.dataTransfer.files);
                }
            },

            /**
             * Drag-n-drop ending
             *
             * @param {Event} e
             */
            dropOff (e) {
                e.stopPropagation();
                e.preventDefault();
                this.isDragging = false;
            },

            /**
             * Drag out of window
             *
             * @param {Event} e
             */
            dragOff (e) {
                e.stopPropagation();
                e.preventDefault();
                if (!App.eventOnElement(e, this.$refs.mainContainer)) {
                    this.isDragging = false;
                }
            },

            /**
             * Dispatches input events for value and content
             */
            dispatchInputEvents(filename, content) {
                // Dispatch new input event with new value
                this.$emit('input', filename);
                // Dispatch new event for parent with new image content
                this.$emit(this.events.IMAGE_CHANGED, content);
            }
        },

        // Component mounted event handler
        mounted () {
            this.$refs.mainContainer.addEventListener('dragenter', this.onDragEnter, true);
            this.$refs.mainContainer.addEventListener('dragover', this.onDragOver, true);
            this.$refs.mainContainer.addEventListener('drop', this.onDrop, true);
            // Add screen wrapper listeners to stop drag-n-drop
            this.$refs.dragNDropScreenWrapper.addEventListener('drop', this.dropOff);
            this.$refs.dragNDropScreenWrapper.addEventListener('dragleave', this.dragOff);
        }
    }
</script>

<style lang="css">
    /* Root container */
    .image-uploader {
        position: relative;
        display: flex;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    }

    /* Wrapper for file input */
    .image-uploader__input-wrapper {
        overflow: hidden;
        position: relative;
        border-radius: 4px;
        float: left;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(0, 0, 0, 0.2);
        transition: 0.4s background;
        width: 40px;
    }

    .image-uploader__input-wrapper:hover {
        background: #e0e0e0;
    }

    /* Hidden file input */
    .image-uploader__input {
        position: absolute;
        display: block;
        min-height: 100%;
        opacity: 0;
        right: 0;
        top: 0;
        text-align: right;
        cursor: pointer;
    }

    /* Wrapper for image */
    .image-uploader__image-wrapper {
        height: 120px;
        border-radius: 1px;
        overflow-y: hidden;
        justify-content: center;
        align-items: center;
        text-align: center;
        vertical-align: middle;
        display: flex;
        padding: 2px;
        width: 100%;
    }

    /* Target image */
    img.image-uploader__image {
        max-height: 100%;
        height: auto;
        border: none;
        margin: auto;
        display: block;
    }

    /* Two settings for image width */
    img.image-uploader__image.with-info {
        max-width: 60%;
    }
    img.image-uploader__image.without-info {
        max-width: 100%;
    }

    /* Wrapper for image info text */
    .image-uploader__image-info {
        height: 100%;
        width: 40%;
        text-align: left;
        vertical-align: top;
        font-family: monospace, Courier, Monospaced;
        background-color: inherit;
        border: none;
        margin: 0;
        padding: 0 0 0 10px;
    }

    /* Wrapper for screen background until drag-n-drop is active */
    .image-loader__drag-n-drop-screen-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        background-color: #808080;
        opacity: 0.2;
    }

    /* Wrapper for component until drag-n-drop is active */
    .image-loader__drag-n-drop-wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: #808080;
        opacity: 0.9;
        border: none;
        border-radius: 4px;
    }

    /* Drag-n-drop wrapper icon */
    .image-loader__drag-n-drop-text {
        position: relative;
        top: 50%;
        left: 50%;
        margin-left: -60px;
        margin-top: -56px;
        font-size: 8em;
    }

    /* Clear image icon */
    .image-loader__clear-icon {
        float: right;
        margin: 4px 4px 0 0;
        cursor: pointer;
        color: #555;
    }
</style>