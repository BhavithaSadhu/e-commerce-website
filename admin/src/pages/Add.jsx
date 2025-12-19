import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({token}) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setprice] = useState("");
  const [category, setcategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("TopWear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

 

  // helper for rendering upload preview src
  const previewSrc = (file) => {
    return !file ? assets.upload_area : URL.createObjectURL(file);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);


    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      fd.append("price", price);
      fd.append("category", category);
      fd.append("subCategory", subCategory);
      fd.append("bestseller", bestseller ? "true" : "false");
      // send sizes as JSON string (server expects JSON.parse or robust parser)
      fd.append("sizes", JSON.stringify(sizes));

      // Append files only if present
      image1 && fd.append("image1", image1);
      image2 &&fd.append("image2", image2);
      image3 && fd.append("image3", image3);
      image4 && fd.append("image4", image4);

      
      console.log("TOKEN FRONTEND:", token);


      const response = await axios.post(backendUrl + "/api/product/add", fd,{headers:{token}})

      
      if(response.data.success)
      {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setprice('')
      }
        else{
          // eslint-disable-next-line no-undef
          console.log(error);
        // eslint-disable-next-line no-undef
        toast.error(error.message)
      }
    }
    catch (error) {
  console.log(error);
  toast.error(error.message)
  }

  }

  return (
    <form className='flex flex-col w-full items-start gap-3' onSubmit={onSubmitHandler} >
      <div>
        <p className="mb-3">Upload Image</p>

        <div className="flex gap-2 ">
          
          <label htmlFor="image1" className="upload-box">
            <img src={previewSrc(image1)} alt="" className="w-1/2 opacity-60" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" className="hidden" />
          </label>

          <label htmlFor="image2" className="upload-box">
            <img src={previewSrc(image2)} alt="" className="w-1/2 opacity-60" />
            <input  onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" className="hidden" />
          </label>

          <label htmlFor="image3" className="upload-box">
            <img src={previewSrc(image3)} alt="" className="w-1/2 opacity-60" />
            <input  onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" className="hidden" />
          </label>

          <label htmlFor="image4" className="upload-box">
            <img src={previewSrc(image4)} alt="" className="w-1/2 opacity-60" />
            <input  onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" className="hidden" />
          </label>
        </div>
      </div>

      <div className='w-full' >
        <p className='mb-2' >Product Name</p>
        <input
          className='w-full max-w-[500px] px-3 py-2'
          type="text"
          placeholder='Type Name'
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className='w-full' >
        <p className='mb-2' >Product Description</p>
        <textarea
          className='w-full max-w-[500px] px-3 py-2'
          placeholder='description ....'
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8' >
        <div>
          <p className='mb-2' >Product Category</p>
          <select className='w-full px-3 py-2' value={category} onChange={(e) => setcategory(e.target.value)}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2' >Product Sub-Category</p>
          <select className='w-full  px-3 py-2' value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className='mb-2 ' >Product price</p>
          <input
            className='w-full px-3 py-2 sm:w-[120px]'
            type="number"
            placeholder='100'
            value={price}
            onChange={(e) => setprice(e.target.value)}
          />
        </div>
      </div>

      <div className='mb-2' >
        <p>Product Sizes</p>

        <div className='flex gap-3'>
          <div>
            <p
              className={`${sizes.includes("S") ? "bg-pink-200" : "bg-slate-200"}px-3 py-1 cursor-pointer ${sizes.includes('S') ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(s => s !== "S") : [...prev, "S"])}
            >S</p>
          </div>
          <div>
            <p
              className={`${sizes.includes("M") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer ${sizes.includes('M') ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(s => s !== "M") : [...prev, "M"])}

            >M</p>
          </div>
          <div >
            <p
              className={`${sizes.includes("L") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer ${sizes.includes('L') ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(s => s !== "L") : [...prev, "L"])}

            >L</p>
          </div>
          <div>
            <p
              className={`${sizes.includes("XL") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer ${sizes.includes('XL') ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(s => s !== "XL") : [...prev, "XL"])}

            >XL</p>
          </div>
          <div>
            <p
              className={`${sizes.includes("XXL") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer ${sizes.includes('XXL') ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(s => s !== "XXL") : [...prev, "XXL"])}

            > XXL</p>
          </div>
        </div>
      </div>

      <div className='flex gap-2 mt-2' >
        <input
          type="checkbox"
          id='bestseller'
          checked={bestseller}
          onChange={() => setBestseller(prev => !prev)}
        />
        <label className='cursor-pointer' htmlFor="bestseller">ADD TO BEST SELLER</label>
      </div>

      {message && <div className="text-sm text-red-600 mt-2">{message}</div>}

      <button className='text-white bg-black w-28 py-3 mt-4 ' type='submit' disabled={loading}>
        {loading ? "ADDING..." : "ADD"}
      </button>
    </form>
  )
}

export default Add
