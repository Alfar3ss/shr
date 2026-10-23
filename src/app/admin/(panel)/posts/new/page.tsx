import PostForm from '../../../PostForm';

export default function NewPost() {
  return (<div className="space-y-5"><h1 className="text-2xl font-bold">New post</h1><PostForm post={{ locale: 'en' }} /></div>);
}
