import React, { useState } from 'react'
import { Label } from 'flowbite-react'
import Button from '../../components/shared/button'
import Card from '../../components/shared/card'

import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

import { BiUpload } from 'react-icons/bi'
import { handleCreateProduct, handleDisplayProductImage, handleProductImage } from '../../services/product';
import { Formik } from 'formik'

function Addproduct() {
    const [loading, setIsLoading] = useState(false)
    const [isload, setIsLoad] = useState(false)
    const [load, setLoad] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedImageDisplay, setSelectedImageDisplay] = useState(null)
    const [preview, setPreview] = useState(null)
    const [imageId, setImageId] = useState("")
    const [previews, setPreviews] = useState(null)
    const Navigate = useNavigate()
    const [product, setProduct] = useState({
        name: "",
        description: "",
        shipping_days_min: null,
        shipping_days_max: null,
        category_id: 25,
        price: "",
        specifications: [],
        interest_rule: [{
            monthly: { min: 0, max: 0, rate: 0 },
            weekly: { min: 0, max: 0, rate: 0 }
        }],
        repayment_policies: {
            description: "",
            tenure_unit: "",
            weekly_tenure: { min: null, max: null },
            monthly_tenure: { min: null, max: null },
            down_percentage: { min: null, max: null }
        },

    })






    const addInterestRule = () => {
        setProduct(prevProduct => ({
            ...prevProduct,
            interest_rule: [...prevProduct.interest_rule, { min: null, max: null, rate: null, interval: null }]
        }));
    };
    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const newSpecifications = [...product.specifications];
        newSpecifications[index][name] = value;
        setProduct({ ...product, specifications: newSpecifications });
    };

    const addSpecification = () => {
        setProduct({
            ...product,
            specifications: [...product.specifications, { attribute: "", value: "" }]
        });
    };
    const handleChangeInterest = (index, e) => {
        const newInterestRules = [...product.interest_rule];
        newInterestRules[index][e.target.name] = e.target.value;
        setProduct({ ...product, interest_rule: newInterestRules });
    };


    const handleInput = (e) => {
        const { name, value } = e.target
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }))
    }
    const handleInputs = (e) => {
        const { name, value } = e.target;
        const keys = name.split(".");
        setProduct((prevProduct) => {
            let updatedProduct = { ...prevProduct };
            let current = updatedProduct;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return updatedProduct;
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for required fields
        const errors = [];

        // Validate main product details
        if (!product.name) errors.push("Product name is required.");
        if (!product.description) errors.push("Product description is required.");
        if (!product.shipping_days_min || product.shipping_days_min <= 0)
            errors.push("Minimum shipping days must be greater than 0.");
        if (!product.shipping_days_max || product.shipping_days_max <= 0)
            errors.push("Maximum shipping days must be greater than 0.");
        if (!product.price || product.price <= 0) errors.push("Product price is required.");

        // Validate specifications
        if (!product.specifications || product.specifications.length === 0)
            errors.push("At least one product specification is required.");

        // Validate interest rules
        const weeklyRules = product.interest_rule.filter(rule => rule.interval === "weekly");
        const monthlyRules = product.interest_rule.filter(rule => rule.interval === "monthly");

        if (weeklyRules.length === 0 && monthlyRules.length === 0)
            errors.push("At least one weekly or monthly interest rule is required.");

        // Validate repayment policies
        if (!product.repayment_policies.description)
            errors.push("Repayment policy description is required.");
        if (!product.repayment_policies.tenure_unit)
            errors.push("Repayment policy tenure unit is required.");
        if (
            !product.repayment_policies.weekly_tenure.min ||
            !product.repayment_policies.weekly_tenure.max
        )
            errors.push("Weekly tenure minimum and maximum are required.");
        if (
            !product.repayment_policies.monthly_tenure.min ||
            !product.repayment_policies.monthly_tenure.max
        )
            errors.push("Monthly tenure minimum and maximum are required.");
        if (
            !product.repayment_policies.down_percentage.min ||
            !product.repayment_policies.down_percentage.max
        )
            errors.push("Down payment percentage minimum and maximum are required.");

        // If there are any errors, prevent submission and show error messages
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error)); // Display each error as a Toastify notification
            return;
        }

        // Build payload
        const payload = {
            name: product.name || "",
            description: product.description || "",
            shipping_days_min: Number(product.shipping_days_min || 0),
            shipping_days_max: Number(product.shipping_days_max || 0),
            category_id: 208,
            price: Number(product.price || 0),
            specifications: product.specifications
                ? product.specifications.map(spec => ({
                    [spec.attribute]: spec.value
                }))
                : [],
            interest_rule: {
                weekly: weeklyRules.length > 0
                    ? weeklyRules.map(rule => ({
                        min: rule.min ? Number(rule.min) : 0,
                        max: rule.max ? Number(rule.max) : 0,
                        rate: rule.rate ? Number(rule.rate) : 0,
                    }))
                    : [{ min: 0, max: 0, rate: 0 }],
                monthly: monthlyRules.length > 0
                    ? monthlyRules.map(rule => ({
                        min: rule.min ? Number(rule.min) : 0,
                        max: rule.max ? Number(rule.max) : 0,
                        rate: rule.rate ? Number(rule.rate) : 0,
                    }))
                    : [{ min: 0, max: 0, rate: 0 }]
            },
            repayment_policies: product.repayment_policies
                ? {
                    description: product.repayment_policies.description || "",
                    tenure_unit: product.repayment_policies.tenure_unit || "",
                    weekly_tenure: {
                        min: Number(product.repayment_policies.weekly_tenure?.min || 0),
                        max: Number(product.repayment_policies.weekly_tenure?.max || 0),
                    },
                    monthly_tenure: {
                        min: Number(product.repayment_policies.monthly_tenure?.min || 0),
                        max: Number(product.repayment_policies.monthly_tenure?.max || 0),
                    },
                    down_percentage: {
                        min: Number(product.repayment_policies.down_percentage?.min || 0),
                        max: Number(product.repayment_policies.down_percentage?.max || 0),
                    },
                }
                : {}
        };

        console.log(payload);
        setIsLoading(true);
        try {
            const response = await handleCreateProduct(payload);
            console.log(response.data.id)
            if (response) {
                console.log(response)
                setImageId(response.data.id)
                toast.success("Product created successfully");

            }



        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!preview) {
            toast.error('Please select an image to upload.');
            return;
        }

        const base64Image = preview.split(',')[1];

        try {
            setIsLoad(true)
            console.log(base64Image);
            const response = await handleProductImage(imageId, { attachment_type: 'products', image: base64Image });
            console.log(response);
            if (response && response.status === 200) {
                toast.success('Image uploaded successfully!');
            } else {
                toast.error('Failed to upload the image. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('An error occurred while uploading the image.');
        } finally {
            setIsLoad(false)
        }
    };
    const handleImageChangeDisplay = (event) => {
        const file = event.target.files[0];
        setSelectedImageDisplay(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviews(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadDisplay = async () => {
        if (!previews) {
            toast.error('Please select an image to upload.');
            return;
        }

        const base64Image = previews.split(',')[1];

        try {
            setLoad(true)
            console.log(base64Image);
            const response = await handleDisplayProductImage(imageId, { attachment_type: 'products', image: base64Image });
            console.log(response);
            if (response && response.status === 200) {
                toast.success('Image uploaded successfully!');
            } else {
                toast.error('Failed to upload the image. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('An error occurred while uploading the image.');
        } finally {
            setLoad(false)
        }
    };


    return (
        <div>
            <div className="flex items-center justify-between p-4">
                <h1 className="text-3xl font-semibold">
                    Products <span className="text-black-400">{'>'}</span> Add Products
                </h1>
                <div className='flex gap-3'>
                    <Button
                        label="Cancel"
                        variant="transparent"
                        size="lg"
                        className="text-sm w-[150px]"
                    />
                    <Button
                        label="Add Products"
                        variant="solid"
                        size="md"
                        className="text-sm px-6 py-5"
                    />
                </div>
            </div>
            <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-10'>Product Information</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>

                    <form onSubmit={(e) => handleSubmit(e)} >
                        <div>
                            <div className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>
                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="name" value="Product name" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="name"
                                            type="text"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder="Enter Product name"
                                            value={product.name}
                                            name='name'
                                            onChange={handleInput}
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="shipping_days_min" value="Shipping Days Min" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="shipping_days_min"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            type="number"
                                            value={product.shipping_days_min}
                                            name='shipping_days_min'
                                            onChange={handleInput}
                                            placeholder='Enter shipping_days_min'
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="shipping_days_max" value="Shipping Days Max" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="shipping_days_max"
                                            type="number"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            value={product.shipping_days_max}
                                            name='shipping_days_max'
                                            onChange={handleInput}
                                            placeholder='Enter shipping_days_max'

                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="price" value="Price" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="price"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            type="text"
                                            value={product.price}
                                            name='price'
                                            onChange={handleInput}
                                            placeholder='Enter product price'
                                        />

                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="category" value="Category" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="category"
                                            type="number"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder="e.g., Electronics"
                                            name='category_id'
                                            value={product.category_id}
                                            onChange={handleInput}


                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='p-10'>
                                <div className=' flex mt-[-75px]'>
                                    <div className="w-full lg:w-[65%] sm:w-[90%]">
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="description" value="Description" />
                                        </div>
                                        <textarea
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="description"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full h-40 resize-none"
                                            placeholder="Describe your product, services, or business needs here..."
                                            name='description'
                                            value={product.description}
                                            onChange={handleInput}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>


                            <div className='p-4'>
                                <Card className='w-full h-full bg-white'>
                                    <h3 className='p-3 px-7 flex items-center justify-between'>
                                        <span>Specifications</span>
                                        <button
                                            type="button"
                                            className="bg-[#0f5d30] text-white px-4 py-2 rounded"
                                            onClick={addSpecification}
                                        >
                                            + Add Specification
                                        </button>
                                    </h3>
                                    <div className='w-full border-t-2 border-gray-200'></div>
                                    <div className='flex flex-col lg:flex-row gap-12 px-7 pb-14 mt-5'>
                                        {product.specifications.length === 0 ? (
                                            <div className="p-10 flex justify-center items-center text-center text-gray-500">No specifications added yet</div>
                                        ) : (
                                            product.specifications.map((spec, index) => (
                                                <div key={index} className="flex flex-col lg:flex-row gap-4 w-full">
                                                    <div className="flex-1">
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`attribute-${index}`} value="Attribute" />
                                                        </div>
                                                        <input
                                                            id={`attribute-${index}`}
                                                            type="text"
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            placeholder="Enter attribute (e.g., Weight, Colour)"
                                                            name="attribute"
                                                            value={spec.attribute}
                                                            onChange={(e) => handleChange(index, e)}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`value-${index}`} value="Value" />
                                                        </div>
                                                        <input
                                                            id={`value-${index}`}
                                                            type="text"
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            placeholder="Enter value (e.g., 0.15 kg, white)"
                                                            name="value"
                                                            value={spec.value}
                                                            onChange={(e) => handleChange(index, e)}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </Card>
                            </div>




                            <div className='p-4'>
                                <Card className='w-full h-full bg-white'>
                                    <h3 className='p-3 px-7 flex justify-between items-center'>
                                        <span>Product Interest Rate Rule</span>
                                        <button
                                            type="button"
                                            className="bg-[#0f5d30] text-white px-4 py-2 rounded"
                                            onClick={addInterestRule}
                                        >
                                            + Add Interest Rule
                                        </button>
                                    </h3>
                                    <div className='w-full border-t-2 border-gray-200'></div>

                                    {product.interest_rule.length === 0 ? (
                                        <div className="p-10 text-center text-gray-500">
                                            No product interval added yet
                                        </div>
                                    ) : (
                                        product.interest_rule.map((rule, index) => (
                                            <div key={index} className='flex flex-col lg:flex-row gap-12 px-7 pb-7 mt-4'>
                                                <div className="flex flex-col gap-4 w-full lg:w-1/3">
                                                    <div>
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`interest-rule-min-${index}`} value="Min" />
                                                        </div>
                                                        <input
                                                            style={{ color: "#202224", borderRadius: "8px" }}
                                                            id={`interest-rule-min-${index}`}
                                                            type="number"
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            name="min"
                                                            value={rule.min || ''}
                                                            onChange={(e) => handleChangeInterest(index, e)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-4 w-full lg:w-1/3">
                                                    <div>
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`interest-rule-rate-${index}`} value="Rate" />
                                                        </div>
                                                        <input
                                                            style={{ color: "#202224", borderRadius: "8px" }}
                                                            id={`interest-rule-rate-${index}`}
                                                            type="number"
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            name="rate"
                                                            value={rule.rate || ''}
                                                            onChange={(e) => handleChangeInterest(index, e)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-4 w-full lg:w-1/3">
                                                    <div>
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`interest-rule-max-${index}`} value="Max" />
                                                        </div>
                                                        <input
                                                            style={{ color: "#202224", borderRadius: "8px" }}
                                                            id={`interest-rule-max-${index}`}
                                                            type="number"
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            name="max"
                                                            value={rule.max || ''}
                                                            onChange={(e) => handleChangeInterest(index, e)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-4 w-full lg:w-1/3">
                                                    <div>
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`interest-rule-interval-${index}`} value="Interval" />
                                                        </div>
                                                        <select
                                                            style={{ color: "#202224", borderRadius: "8px" }}
                                                            id={`interest-rule-interval-${index}`}
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            name="interval"
                                                            value={rule.interval || ''}
                                                            onChange={(e) => handleChangeInterest(index, e)}
                                                        >
                                                            <option value="" disabled>Select interval</option>
                                                            <option value="weekly">Weekly</option>
                                                            <option value="monthly">Monthly</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </Card>
                            </div>





                            <div className='p-4'>
                                <Card className='w-full h-full bg-white'>
                                    <h3 className='p-3 px-7'>Create Repayment Plan</h3>
                                    <div className='w-full border-t-2 border-gray-200'></div>

                                    <div className='flex flex-col lg:flex-row gap-7 pb-7 mt-5 px-7'>
                                        <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                            <div>
                                                <div className="mb-2 block">
                                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="tenure_unit" value="Tenure Unit" />
                                                </div>
                                                <input
                                                    style={{ color: "#202224", borderRadius: "8px" }}
                                                    type="text"
                                                    value={product.repayment_policies?.tenure_unit ?? ""}
                                                    name='repayment_policies.tenure_unit'
                                                    onChange={handleInputs}
                                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                    placeholder="Enter tenure unit"
                                                />
                                            </div>
                                            <div>
                                                <div className="mb-2 block">
                                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="weekly_tenure" value="Weekly Tenure" />
                                                </div>
                                                <div className='flex gap-2'>
                                                    <input
                                                        style={{ color: "#202224", borderRadius: "8px" }}
                                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                        type="number"
                                                        value={product.repayment_policies.weekly_tenure.min ?? ""}
                                                        name='repayment_policies.weekly_tenure.min'
                                                        onChange={handleInputs}
                                                        placeholder=' min'
                                                    />
                                                    <input
                                                        style={{ color: "#202224", borderRadius: "8px" }}
                                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                        type="number"
                                                        value={product.repayment_policies.weekly_tenure.max ?? ""}
                                                        name='repayment_policies.weekly_tenure.max'
                                                        onChange={handleInputs}
                                                        placeholder='max'
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="mb-2 block">
                                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="description" value="Description" />
                                                </div>
                                                <textarea
                                                    style={{ color: "#202224", borderRadius: "8px" }}
                                                    value={product.repayment_policies.description ?? ""}
                                                    name='repayment_policies.description'
                                                    onChange={handleInputs}
                                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full h-40 resize-none"
                                                    placeholder='Enter description'
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                            <div>
                                                <div className="mb-2 block">
                                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="down_percentage" value="Down Percentage" />
                                                </div>
                                                <div className='flex gap-2'>
                                                    <input
                                                        style={{ color: "#202224", borderRadius: "8px" }}
                                                        type="number"
                                                        value={product.repayment_policies.down_percentage.min ?? ""}
                                                        name='repayment_policies.down_percentage.min'
                                                        onChange={handleInputs}
                                                        placeholder=" min"
                                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                    />
                                                    <input
                                                        style={{ color: "#202224", borderRadius: "8px" }}
                                                        type="number"
                                                        value={product.repayment_policies.down_percentage.max ?? ""}
                                                        name='repayment_policies.down_percentage.max'
                                                        onChange={handleInputs}
                                                        placeholder=" max"
                                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="mb-2 block">
                                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="monthly_tenure" value="Monthly Tenure" />
                                                </div>
                                                <div className='flex gap-2'>
                                                    <input
                                                        style={{ color: "#202224", borderRadius: "8px" }}
                                                        type="number"
                                                        value={product.repayment_policies.monthly_tenure.min ?? ""}
                                                        name='repayment_policies.monthly_tenure.min'
                                                        onChange={handleInputs}
                                                        placeholder=' min'
                                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                    />
                                                    <input
                                                        style={{ color: "#202224", borderRadius: "8px" }}
                                                        type="number"
                                                        value={product.repayment_policies.monthly_tenure.max ?? ""}
                                                        name='repayment_policies.monthly_tenure.max'
                                                        onChange={handleInputs}
                                                        placeholder='max'
                                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>



                            <div className='mb-7  px-11'>
                                <Button type="submit" size='lg' className="text-sm w-[150px]" label='Create Product' loading={loading} />


                            </div>
                        </div>
                    </form>



                </Card>
            </div>


            <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-11'>Upload Images</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>
                    <div className='flex gap-10  py-5 px-11'>
                        <div className='w-[17rem] flex gap-10 h-12 py-1 mt-4 px-4 rounded-md border-1 border-gray-200 shadow bg-white '>

                            <div className='flex gap-2'>
                                <input
                                    type="file"
                                    accept='image/*'
                                    hidden
                                    id="imageInput"
                                    onChange={handleImageChange}
                                />
                                <button
                                    className="flex items-center justify-center mt-1 w-8 h-8 bg-gray-100 border-0 border-gray-300 rounded-full hover:bg-gray-200 focus:outline-none"
                                    aria-label="Edit"
                                    onClick={() => document.getElementById('imageInput').click()}
                                >
                                    <BiUpload className="text-gray-500 w-5 h-5 text-lg" />
                                </button>
                                <p className='text-xs mt-3 text-[#0A0F0C] font-[500]'>Product Image</p>
                                {preview && (
                                    <img src={preview} alt="Uploaded Image" className='w-6 h-6 mt-2 rounded-md' />
                                )}

                            </div>
                        </div>


                    </div>
                    <div className='px-11 pb-5'>
                        <Button
                            label="Upload"
                            variant="solid"
                            loading={isload}
                            onClick={handleUpload}
                            size="md"
                            className="text-sm px-6 py-5"
                        />

                    </div>


                </Card>

            </div>
            <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-11'>Upload Display Product Image</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>
                    <div className='flex gap-10  py-5 px-11'>
                        <div className='w-[17rem] flex gap-10 h-12 py-1 mt-4 px-4 rounded-md border-1 border-gray-200 shadow bg-white '>

                            <div className='flex gap-2'>
                                <input
                                    type="file"
                                    accept='image/*'
                                    hidden
                                    id="imageInputDisplay"
                                    onChange={handleImageChangeDisplay}
                                />
                                <button
                                    className="flex items-center justify-center mt-1 w-8 h-8 bg-gray-100 border-0 border-gray-300 rounded-full hover:bg-gray-200 focus:outline-none"
                                    aria-label="Edit"
                                    onClick={() => document.getElementById('imageInputDisplay').click()}
                                >
                                    <BiUpload className="text-gray-500 w-5 h-5 text-lg" />
                                </button>
                                <p className='text-xs mt-3 text-[#0A0F0C] font-[500]'>Product Image</p>
                                {previews && (
                                    <img src={previews} alt="Uploaded Image" className='w-6 h-6 mt-2 rounded-md' />
                                )}

                            </div>
                        </div>


                    </div>
                    <div className='px-11 pb-5'>
                        <Button
                            label="Upload"
                            variant="solid"
                            loading={load}
                            onClick={handleUploadDisplay}
                            size="md"
                            className="text-sm px-6 py-5"
                        />

                    </div>


                </Card>

            </div>


        </div>
    )
}

export default Addproduct
