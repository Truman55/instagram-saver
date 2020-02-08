import get from 'lodash.get';


export class Loader {
    constructor (id, success, error) {
        this.id = id;
        this._photos = [];
        
        this.success = success || function () {};
        this.error = error || function () {};

        this._fetch();
    }

    async _fetch () {
        const response = await fetch(`https://www.instagram.com/p/${this.id}/?__a=1`);
        const { graphql } = await response.json();
        const multiplePost = get(
            graphql, 
            'shortcode_media.edge_sidecar_to_children.edges', []
        );

        if (multiplePost.length) {
            await this._parseMultiplePost(multiplePost);
            return;
        }

        this._parseSinglePost(graphql);
    }

    async _parseSinglePost (data) {
        const isVideo = get(data, 'shortcode_media.is_video', false);
        
        if (isVideo) {
            this._throwError('В посте нет фотографий');
            return;
        }

        const singlePostArray = get(data, 'shortcode_media.display_resources', []);
        const src = singlePostArray[singlePostArray.length - 1]['src'];
        this._photos.push(src);

        this.success({
            photos: this.photos
        })
    }

    async _parseMultiplePost (posts) {
        for (let post of posts) {
            const { node } = post;
            const imageData = get(node, 'display_resources', []);

            if (!imageData.length || node.is_video) {
                return;
            }
            
            const src = imageData[imageData.length - 1]['src'];
            this._photos.push(src);
        }

        if (this.photos.length) {
            this.success({
                photos: this.photos
            });

            return;
        }

        this._throwError({
            text: 'В данном посте нет фотографий :('
        });
    }

    _throwError (text) {
        this.error({
            message: text
        });

        console.error(text);
    }

    get photos () {
        return this._photos;
    }
}