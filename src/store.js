import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		posts: [],
		activePost: null
	},
	mutations: {
		SET_POSTS (state, posts) {
			state.posts = posts;
		},
		SET_ACTIVE_POST (state, activePost) {
			state.activePost = activePost;
		},
		UPDATE_POST (state, post) {
			const index = state.posts.findIndex(p => p.uid === post.uid);

			if (index > -1) {
				state.posts = Object.assign([], state.posts, {
					[index]: post
				})
			}
		}
	},
	actions: {
		getPosts ({ commit }) {
			const posts = window.localStorage.getItem('posts');

            if (!posts) {
				return;
			}
			
            commit('SET_POSTS', JSON.parse(posts));
		},

		setActivePost ({ commit }, post) {
			commit('SET_ACTIVE_POST', post);
		},

		saveNewPost ({ state, commit, dispatch }, post) {
			const posts = Object.assign([], state.posts, [
				...state.posts
			]);

			posts.push(post);
			commit('SET_POSTS', posts);
			dispatch('saveToLS');
		},

		updatePost ({ commit, dispatch }, post) {
			commit('UPDATE_POST', post);
			dispatch('saveToLS');
		},

		saveToLS ({ state }) {
			window.localStorage.setItem('posts', JSON.stringify(state.posts));
		}
	},
	getters: {
		posts: ({ posts }) => posts
	}
})
