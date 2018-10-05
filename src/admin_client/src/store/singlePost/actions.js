import { firestore, storageRef } from '@/utils/firebase';
import metadata from '@/helpers/metadata';
import quillToHtml from '@/helpers/quillToHtml';
import {
  POST_CONTENT_TYPE,
  POST_FIELD_FEATURED_IMAGE,
  POST_ACTION_UPLOAD
} from '@/store/types';

const collectionRef = (collectionName, newPost = true, uid = null) => {
  const collection = firestore.collection(collectionName);
  return newPost ? collection.doc() : collection.doc(uid);
};

const uploadFeaturedImage = async (imgName, featuredImage) => {
  try {
    const imgRef = storageRef.child(imgName);
    await imgRef.putString(featuredImage, 'data_url');
  } catch (error) {
    throw new Error(error);
  }
};

const uploadPost = ({ commit }, payload) => {
  commit(POST_ACTION_UPLOAD, true);

  // const { body, title, featuredImage, tags, permalink } = state;
  // const {
  //   layout: { postMode },
  //   posts: { contentType }
  // } = rootState;

  // let status;
  // if (postMode === 'edit') {
  //   status = state.status ? 'published' : 'unpublished';
  // } else {
  //   status = 'published';
  // }

  // const template = contentType === 'pages' ? 'page' : state.template;
  // const path = metadata.generatePaths(permalink, template);
  // console.log(body)
  // const properties = {
  //   data: {
  //     // body: quillToHtml(body),
  //     body: body,
  //     title
  //   },
  //   path,
  //   permalink,
  //   publishTime: new Date(),
  //   updateTime: new Date(),
  //   status,
  //   template
  // };

  // if (contentType !== 'pages') {
  //   properties.tags = tags;
  // }

  // return new Promise(async (resolve, reject) => {
  //   let imgName;

  //   if (featuredImage.dataUri) {
  //     imgName = metadata.generateFeaturedImageName(permalink);
  //     await uploadFeaturedImage(imgName, featuredImage.src);
  //     properties.data.featuredImage = imgName;
  //   } else if (featuredImage.src) {
  //     properties.data.featuredImage = featuredImage.src;
  //   }

  //   try {
  //     let docRef;
  //     if (postMode === 'edit') {
  //       docRef = collectionRef(getters[POST_CONTENT_TYPE], false, payload);
  //       await docRef.set(properties, { merge: true });
  //     } else {
  //       docRef = collectionRef(getters[POST_CONTENT_TYPE]);
  //       await docRef.set(properties);
  //     }
  //     resolve();
  //   } catch (error) {
  //     reject(error);
  //   }
  // });
};

const deletePost = async ({ getters }, payload) => {
  const featuredImage = getters[POST_FIELD_FEATURED_IMAGE];

  return new Promise(async (resolve, reject) => {
    try {
      if (featuredImage) {
        const imageRef = storageRef.child(featuredImage);
        await imageRef.delete();
      }

      const docRef = collectionRef(getters[POST_CONTENT_TYPE], false, payload);
      await docRef.delete();
      resolve();
    } catch (error) {
      console.log('ERROR', error);
      reject();
    }
  });
};

export default {
  uploadPost,
  deletePost
};
