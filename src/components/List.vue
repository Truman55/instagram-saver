<script>
import Post from './Post.vue';

export default {
    name: 'List',
    data () {
        return {
            list: []
        }
    },
    methods: {
        createPost () {
            this.$emit('pushPage', Post);
        },
        scanPosts () {
            const posts = window.localStorage.getItem('posts');

            if (posts) {
                this.list = JSON.parse(posts);
            }
        }
    },
    created () {
        this.scanPosts();
    },
    mounted () {
        window.addEventListener('storage', () => {
            console.log('blah')
        }, false)
    }
};
</script>

<template lang="pug">
v-ons-page
    v-ons-toolbar
        .center Instagram Saver

    v-ons-list(
        v-if="list.length"
    )
        v-ons-list-header Последние посты
        v-ons-list-item(
            v-for="post in list"
        ) {{ post.url }}
    
    template(v-else)
        p.empty-text Вы еще не сохранили ни одного поста

    v-ons-fab(
        position='bottom right'
        visible,
        @click="createPost"
    )
        | +
</template>

<style lang="scss" scoped>
.empty-text {
    text-align: center;
}
</style>