import {useState} from 'react';
import {useUserContext} from "../../context/UserContext";
import {useNavigate} from 'react-router-dom';

import {create} from 'services/post';

import Banner from 'components/Banner';

export default function CreatePost(props) {
    const {logout} = useUserContext()
    const navigate = useNavigate()

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');

    const [errors, setErrors] = useState(null);

    const logoutHandler = () => {
        logout();
        navigate("/login");
      }

    const onSubmit = async (event) => {
        // <form/>s by default have submit actions. Stop this.
        event.preventDefault();

        // Reset errors upon submit
        setErrors(null);

        try {
            await create(title, description, image);
            
            navigate('/my-posts');
            return;
        }
        catch (e) {
            // Initialize object and arrays
            setErrors(defaultErrors);

            if (!e.cause) {
                console.error(e);
                return;
            }

            // Add each error to the error list
            e.cause.errors.forEach((error) => {
                if (error.startsWith('Title')) {
                    setErrors((current) => ({...current, title: [...current.title, error]}));
                }
                else if (error.startsWith('Description')) {
                    setErrors((current) => ({...current, description: [...current.description, error]}));
                }
                else if (error.startsWith('Image')) {
                    setErrors((current) => ({...current, image: [...current.image, error]}));
                }
            });
        }
    }
    
  return (
    <section className="justify-center items-center min-h-screen bg-gray-300">
      <Banner name="Create Post"/>
      <div className="flex border-4 border-additional rounded rounded-xl bg-white mx-auto my-20 w-96 h-96 justify-center items-center">
        <form {...{onSubmit}} className="flex flex-col w-full mx-2 items-center">
          <h2 className="uppercase text-primary font-medium font-roboto font-black text-4xl mb-4">Create post</h2>
          <div>
            <input type="text" placeholder="Title" value={title} onChange={(event) => { setTitle(event.target.value); }}
            className="font-medium border-2 border-gray-700 w-72 text-yellow-500 focus:outline-none focus:ring p-2 rounded"/>
            <span>{errors?.title.map((error, i) => <div key={i}>{error}</div>)}</span>
          </div>
          <div>
            <textarea placeholder="Description" value={description} onChange={(event) => { setDescription(event.target.value); }}
            className="font-medium border-2 border-gray-700 w-72 text-yellow-500 focus:outline-none focus:ring p-2 rounded mt-1.5"/>
            <span>{errors?.description.map((error, i) => <div key={i}>{error}</div>)}</span>
          </div>
          <div>
            <input type="text" placeholder="Enter an image URL" value={image} onChange={(event) => { setImage(event.target.value); }}
            className="font-medium border-2 border-gray-700 w-72 text-yellow-500 focus:outline-none focus:ring p-2 rounded"/>
            <span>{errors?.image.map((error, i) => <div key={i}>{error}</div>)}</span>
          </div>
          <button type="submit"
          className="mt-6 w-sm transition rounded duration-300 ease-in-out text-xl text-extrabold uppercase bg-primary hover:bg-primary-dark py-2 px-4 text-gray-100" >Create</button>
        </form>
      </div>
    </section>
  );
}

const defaultErrors = _ => ({
    title: [],
    description: [],
    image: [],
});