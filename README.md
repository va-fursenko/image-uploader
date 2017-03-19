# image-uploader

Компонент VueJS2 для загрузки изображений с предпросмотром и поддержкой drag-n-drop.

Picture preview and uploader VueJS2 component with drag-n-drop.

[Пример (Example)](http://insbor.ru/vue/image-uploader/ "Component example")

![Пример (example)](https://raw.githubusercontent.com/va-fursenko/image-uploader/master/example/image-uploader-example.png "Пример (example)")

```html
<image-uploader
        v-model="selectedImage"
        src-prefix="/static/img/uploads/"
        :show-info="false"
        :allow-clear="true"
        placeholder="Выберите изображение"
        id="image0"
        v-on:image-changed="onImageChange"
></image-uploader>
```

Флаг `allow-clear` позволяет сбрасывать выбранное изображение. Флаг `show-info` - позволяет выводить краткую информауию о загруженном изображении (имя файла, расширение, размер). Событие `image-changed` (`events.IMAGE_CHANGED`) вызывается с base64-зашифрованным содержимым загруженного файла.