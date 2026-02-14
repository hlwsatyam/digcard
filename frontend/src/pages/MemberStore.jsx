// import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { 
//   Card, Tabs, Form, Input, Button, Space, Select, 
//   Switch, Upload, Row, Col, Divider, Typography, 
//   Tag, Alert, Table, Modal, InputNumber, TimePicker,
//   message,
//   Popconfirm
// } from 'antd';
// import {
//   ShopOutlined, PictureOutlined, ShoppingOutlined,
//   CalendarOutlined, GlobalOutlined, ShareAltOutlined,
//   FileImageOutlined, PlusOutlined, DeleteOutlined,
//   EditOutlined, UploadOutlined, SaveOutlined,
//   LinkOutlined, MailOutlined, PhoneOutlined,
//   EnvironmentOutlined, CrownOutlined,  
// } from '@ant-design/icons';
 
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import dayjs from 'dayjs';
 

// const { TabPane } = Tabs;
// const { Title, Text } = Typography;
// const { Option } = Select;
// const { TextArea } = Input;

// const MemberStore = () => {
 
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState('basic');
//   const [storeForm] = Form.useForm();
//   const [themeForm] = Form.useForm();
//   const [hoursForm] = Form.useForm();
//   const [socialForm] = Form.useForm();
  
//   const user = JSON.parse(localStorage.getItem('user'));
//   const [store, setStore] = useState(null);
//  const [productModalVisible, setProductModalVisible] = useState(false);
// const [productName, setProductName] = useState('');
// const [productDesc, setProductDesc] = useState('');
// const [productPrice, setProductPrice] = useState(0);
// const [pc, setPC] = useState("makeup");
// const [ProductImg, setProductImg] = useState([]);
//  console.log(ProductImg)
//  const { data: storeData, isLoading, refetch } = useQuery({
//   queryKey: ['store', user?._id],
//   queryFn: async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/stores/owner/${user._id}`);
//       setStore(res.data);
      
      
//       // ========== FIXED: Properly set all form values including contact ==========
//       storeForm.setFieldsValue({
//         name: res.data.name,
//         description: res.data.description,
//         category: res.data.category,
//         // Contact - properly nested
//         contact: {
//           email: res.data.contact?.email,
//           phone: res.data.contact?.phone,
//           website: res.data.contact?.website,
//           address: {
//             street: res.data.contact?.address?.street,
//             city: res.data.contact?.address?.city,
//             state: res.data.contact?.address?.state,
//             country: res.data.contact?.address?.country,
//             zipCode: res.data.contact?.address?.zipCode
//           }
//         }
//       });

//       themeForm.setFieldsValue({
//         primaryColor: res.data.theme?.primaryColor,
//         secondaryColor: res.data.theme?.secondaryColor,
//         backgroundColor: res.data.theme?.backgroundColor,
//         headerColor: res.data.theme?.headerColor,
//         fontFamily: res.data.theme?.fontFamily
//       });

//       hoursForm.setFieldsValue(res.data.businessHours);
//       socialForm.setFieldsValue({ socialMedia: res.data.socialMedia || [] });
      
//       return res.data;
//     } catch (error) {
//       if (error.response?.status === 404) return null;
//       throw error;
//     }
//   },
//   enabled: !!user?._id
// });

//   // Create store
//   const createStore = useMutation({
//     mutationFn: (data) => axios.post('http://localhost:5000/api/stores', { ...data, owner: user._id }),
//     onSuccess: (res) => {
//       setStore(res.data.store);
//       toast.success('Store created successfully!');
//       queryClient.invalidateQueries(['store', user._id]);
//     },
//     onError: (error) => toast.error(error.response?.data?.message || 'Failed to create store')
//   });

//   // Update basic info
//  // Update basic info - FIXED to properly handle contact object
// const updateBasic = useMutation({
//   mutationFn: (data) => {
//     // Extract contact properly
//     const { contact, ...rest } = data;
//     return axios.put(`http://localhost:5000/api/stores/${store._id}/basic`, {
//       ...rest,
//       contact: contact // Send the entire contact object
//     });
//   },
//   onSuccess: () => {
//     toast.success('Store updated!');
//     queryClient.invalidateQueries(['store', user._id]);
//   }
// });

//   // Update theme
//   const updateTheme = useMutation({
//     mutationFn: (data) => axios.put(`http://localhost:5000/api/stores/${store._id}/theme`, data),
//     onSuccess: () => {
//       toast.success('Theme updated!');
//       queryClient.invalidateQueries(['store', user._id]);
//     }
//   });

//   // Upload logo
//   const uploadLogo = useMutation({
//     mutationFn: (file) => {
//       const formData = new FormData();
//       formData.append('file', file);
//       return axios.post(`http://localhost:5000/api/stores/${store._id}/logo`, formData);
//     },
//     onSuccess: () => {
//       toast.success('Logo uploaded!');
//       queryClient.invalidateQueries(['store', user._id]);
//     }
//   });

//   // Upload banner
//   const uploadBanner = useMutation({
//     mutationFn: ({ files, settings }) => {
//       const formData = new FormData();
//       files.forEach(f => formData.append('files', f));
//       formData.append('settings', JSON.stringify(settings));
//       return axios.put(`http://localhost:5000/api/stores/${store._id}/banner`, formData);
//     },
//     onSuccess: () => {
//       toast.success('Banner uploaded!');
//       queryClient.invalidateQueries(['store', user._id]);
//     }
//   });

//   // Delete banner image
//   const deleteBannerImage = useMutation({
//     mutationFn: (index) => axios.delete(`http://localhost:5000/api/stores/${store._id}/banner/${index}`),
//     onSuccess: () => {
//       toast.success('Image deleted');
//       queryClient.invalidateQueries(['store', user._id]);
//     }
//   });

//  // Create product - FIXED for images
//  // Create product - SIMPLIFIED
// const createProduct = useMutation({
//   mutationFn: async ({ data, images }) => {
//     const formData = new FormData();
    
//     // Append images
//     images.forEach((img) => {
//       formData.append('files', img);
//     });
    
//     // Append product data
//     Object.keys(data).forEach(key => {
//       formData.append(key, data[key]?.toString() || '');
//     });
    
//     const response = await axios.post(
//       `http://localhost:5000/api/stores/${store._id}/products`, 
//       formData
//     );
//     return response.data;
//   },
//   onSuccess: () => {
//     toast.success('✅ Product added successfully!');
//     queryClient.invalidateQueries(['store', user._id]);
//   },
//   onError: (error) => {
//     toast.error(error.response?.data?.message || 'Failed to add product');
//   }
// });

//   // Delete product
//   const deleteProduct = useMutation({
//     mutationFn: (index) => axios.delete(`http://localhost:5000/api/stores/${store._id}/products/${index}`),
//     onSuccess: () => {
//       toast.success('Product deleted');
//       queryClient.invalidateQueries(['store', user._id]);
//     }
//   });

//   // Add service
//   const addService = useMutation({
//     mutationFn: (data) => axios.post(`http://localhost:5000/api/stores/${store._id}/services`, data),
//     onSuccess: () => {
//       toast.success('Service added!');
//       queryClient.invalidateQueries(['store', user._id]);
//     }
//   });

//   // Delete service
//   const deleteService = useMutation({
//     mutationFn: (index) => axios.delete(`http://localhost:5000/api/stores/${store._id}/services/${index}`),
//     onSuccess: () => {
//       toast.success('Service deleted');
//       queryClient.invalidateQueries(['store', user._id]);
//     }
//   });

//   // Update hours
//   const updateHours = useMutation({
//     mutationFn: (data) => axios.put(`http://localhost:5000/api/stores/${store._id}/hours`, data),
//     onSuccess: () => {
//       toast.success('Business hours updated!');
//       queryClient.invalidateQueries(['store', user._id]);
//     }
//   });

//   // Update social media
//   const updateSocial = useMutation({
//     mutationFn: (data) => axios.put(`http://localhost:5000/api/stores/${store._id}/social`, data),
//     onSuccess: () => {
//       toast.success('Social links updated!');
//       queryClient.invalidateQueries(['store', user._id]);
//     }
//   });

//   // If no store, show create form
//   if (!storeData && !isLoading) {
//     return (
//       <div className="p-8 max-w-4xl mx-auto">
//         <Card className="shadow-xl rounded-xl border-0">
//           <div className="text-center py-12">
//             <ShopOutlined className="text-6xl text-gray-300 mb-4" />
//             <Title level={2}>Create Your Store</Title>
//             <Text className="text-gray-500 block mb-8">
//               Start your online journey today!
//             </Text>
            
//             <Form
//               form={storeForm}
//               layout="vertical"
//               onFinish={(values) => createStore.mutate(values)}
//               className="max-w-2xl mx-auto"
//             >
//               <Form.Item name="name" label="Store Name" rules={[{ required: true }]}>
//                 <Input size="large" placeholder="e.g., Meg's Makeup Studio" />
//               </Form.Item>
              
//               <Form.Item name="description" label="Description">
//                 <TextArea rows={4} placeholder="Tell customers about your store..." />
//               </Form.Item>
              
//               <Row gutter={16}>
//                 <Col span={12}>
//                   <Form.Item name="category" label="Category">
//                     <Select placeholder="Select category">
//                       <Option value="beauty">Beauty & Cosmetics</Option>
//                       <Option value="fashion">Fashion</Option>
//                       <Option value="art">Art & Crafts</Option>
//                       <Option value="services">Services</Option>
//                     </Select>
//                   </Form.Item>
//                 </Col>
//               </Row>
              
//               <Button 
//                 type="primary" 
//                 htmlType="submit" 
//                 size="large" 
//                 block
//                 loading={createStore.isPending}
//                 className="bg-gradient-to-r from-blue-600 to-indigo-600 h-12"
//               >
//                 Create Store
//               </Button>
//             </Form>
//           </div>
//         </Card>
//       </div>
//     );
//   }

 

//   return (
//     <div className="p-4 md:p-6 lg:p-8">
//       {/* Store Header */}
//       <Card className="shadow-xl rounded-xl border-0 mb-6 overflow-hidden">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div className="flex items-center gap-4">
//             {store?.logo?.url ? (
//               <img src={`http://localhost:5000/${store.logo.url}`} alt={store.name} className="w-16 h-16 object-cover rounded-lg" />
//             ) : (
//               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
//                 <ShopOutlined className="text-white text-2xl" />
//               </div>
//             )}
//             <div>
//               <Title level={3} className="mb-1">{store?.name}</Title>
//               <Tag color="green">Your Store</Tag>
//             </div>
//           </div>
          
//           <div className="flex gap-2">
//             {store?.slug && (
//               <Button 
//                 icon={<GlobalOutlined />}
//                 onClick={() => window.open(`/store/${store.slug}`, '_blank')}
//               >
//                 View Store
//               </Button>
//             )}
//           </div>
//         </div>
//       </Card>

//       {/* Main Tabs */}
//       <Card className="shadow-xl rounded-xl border-0">
//         <Tabs activeKey={activeTab} onChange={setActiveTab} tabPosition="left">
          
//           {/* ========== BASIC INFO ========== */}
//           <TabPane tab={<span><ShopOutlined /> Basic Info</span>} key="basic">
//             <Form form={storeForm} layout="vertical" onFinish={(v) => updateBasic.mutate(v)}>
//               <Row gutter={24}>
//                 <Col span={16}>
//                   <Form.Item name="name" label="Store Name" rules={[{ required: true }]}>
//                     <Input size="large" />
//                   </Form.Item>
                  
//                   <Form.Item name="description" label="Description">
//                     <TextArea rows={4} />
//                   </Form.Item>
                  
//                   <Form.Item name="category" label="Category">
//                     <Select>
//                       <Option value="beauty">Beauty & Cosmetics</Option>
//                       <Option value="fashion">Fashion</Option>
//                       <Option value="art">Art & Crafts</Option>
//                       <Option value="services">Services</Option>
//                     </Select>
//                   </Form.Item>
                  
//                   <Divider>Contact Information</Divider>
                  
//                   <Row gutter={16}>
//                     <Col span={12}>
//                       <Form.Item name={['contact', 'email']} label="Email">
//                         <Input prefix={<MailOutlined />} />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item name={['contact', 'phone']} label="Phone">
//                         <Input prefix={<PhoneOutlined />} />
//                       </Form.Item>
//                     </Col>
//                     <Col span={24}>
//                       <Form.Item name={['contact', 'website']} label="Website">
//                         <Input prefix={<GlobalOutlined />} />
//                       </Form.Item>
//                     </Col>
//                   </Row>
                  
//                   <Divider>Address</Divider>
                  
//                   <Row gutter={16}>
//                     <Col span={16}>
//                       <Form.Item name={['contact', 'address', 'street']} label="Street">
//                         <Input prefix={<EnvironmentOutlined />} />
//                       </Form.Item>
//                     </Col>
//                     <Col span={8}>
//                       <Form.Item name={['contact', 'address', 'city']} label="City">
//                         <Input />
//                       </Form.Item>
//                     </Col>
//                     <Col span={8}>
//                       <Form.Item name={['contact', 'address', 'country']} label="Country">
//                         <Input />
//                       </Form.Item>
//                     </Col>
//                     <Col span={8}>
//                       <Form.Item name={['contact', 'address', 'zipCode']} label="Zip Code">
//                         <Input />
//                       </Form.Item>
//                     </Col>
//                   </Row>
//                 </Col>
                
//                 <Col span={8}>
//                   <Card className="bg-gray-50">
//                     <div className="text-center">
//                       <Title level={5}>Store Logo</Title>
//                       <div className="my-4 flex justify-center">
//                         {store?.logo?.url ? (
//                           <img src={`http://localhost:5000/${store.logo.url}`} alt="Logo" className="w-32 h-32 object-cover rounded-lg" />
//                         ) : (
//                           <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
//                             <FileImageOutlined className="text-4xl text-gray-400" />
//                           </div>
//                         )}
//                       </div>
//                       <Upload
//                         customRequest={({ file }) => uploadLogo.mutate(file)}
//                         showUploadList={false}
//                       >
//                         <Button icon={<UploadOutlined />} block loading={uploadLogo.isPending}>
//                           Upload Logo
//                         </Button>
//                       </Upload>
//                     </div>
//                   </Card>
//                 </Col>
//               </Row>
              
//               <Form.Item className="mt-4">
//                 <Button 
//                   type="primary" 
//                   htmlType="submit"
//                   loading={updateBasic.isPending}
//                   icon={<SaveOutlined />}
//                   className="bg-gradient-to-r from-green-600 to-teal-600"
//                 >
//                   Save Basic Info
//                 </Button>
//               </Form.Item>
//             </Form>
//           </TabPane>

//           {/* ========== THEME ========== */}
//           <TabPane tab={<span><CrownOutlined /> Theme</span>} key="theme">
//             <Form form={themeForm} layout="vertical" onFinish={(v) => updateTheme.mutate(v)}>
//               <Row gutter={24}>
//                 <Col span={12}>
//                   <Card>
//                     <Title level={5}>Colors</Title>
                    
//                     <Form.Item name="primaryColor" label="Primary Color">
//                           <Input type="color" className="w-full h-10" />
//                     </Form.Item>
                    
                   
//                     <Form.Item name="secondaryColor" label="Secondary Color">
//                       <Input type="color" className="w-full h-10" />
//                     </Form.Item>
                    
//                     <Form.Item name="backgroundColor" label="Background Color">
//                       <Input type="color" className="w-full h-10" />
//                     </Form.Item>
                    
//                     <Form.Item name="headerColor" label="Header Color">
//                       <Input type="color" className="w-full h-10" />
//                     </Form.Item>
//                   </Card>
//                 </Col>
                
//                 <Col span={12}>
//                   <Card>
//                     <Title level={5}>Typography</Title>
                    
//                     <Form.Item name="fontFamily" label="Font">
//                       <Select>
//                         <Option value="Inter">Inter</Option>
//                         <Option value="Poppins">Poppins</Option>
//                         <Option value="Roboto">Roboto</Option>
//                         <Option value="Montserrat">Montserrat</Option>
//                       </Select>
//                     </Form.Item>
//                   </Card>
//                 </Col>
//               </Row>
              
//               <Form.Item className="mt-4">
//                 <Button 
//                   type="primary" 
//                   htmlType="submit"
//                   loading={updateTheme.isPending}
//                   icon={<SaveOutlined />}
//                   className="bg-gradient-to-r from-purple-600 to-pink-600"
//                 >
//                   Save Theme
//                 </Button>
//               </Form.Item>
//             </Form>
//           </TabPane>

//           {/* ========== BANNER ========== */}
//           <TabPane tab={<span><PictureOutlined /> Banner</span>} key="banner">
//             <div className="space-y-6">
//               <Alert message="Upload banner images for your store slider" type="info" showIcon />
              
//               <Row gutter={24}>
//                 <Col span={16}>
//                   <Card title="Current Banner Images">
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                       {store?.banner?.media?.map((media, index) => (
//                         <div key={index} className="relative group">
//                           <img 
//                             src={`http://localhost:5000/${media.url}`}
//                             alt={media.alt}
//                             className="w-full h-32 object-cover rounded-lg"
//                           />
//                           <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
//                             <Button 
//                               danger
//                               icon={<DeleteOutlined />}
//                               onClick={() => deleteBannerImage.mutate(index)}
//                               loading={deleteBannerImage.isPending}
//                             />
//                           </div>
//                         </div>
//                       ))}
                      
//                       {(!store?.banner?.media || store.banner.media.length === 0) && (
//                         <div className="col-span-3 text-center py-8">
//                           <PictureOutlined className="text-4xl text-gray-300 mb-2" />
//                           <Text type="secondary">No banner images yet</Text>
//                         </div>
//                       )}
//                     </div>
//                   </Card>
//                 </Col>
                
//                 <Col span={8}>
//                   <Card className="bg-gray-50">
//                     <Title level={5}>Upload New Banner</Title>
//                     <Upload.Dragger
//                       multiple
//                       customRequest={({ file, onSuccess }) => {
//                         setTimeout(() => onSuccess('ok'), 0);
//                       }}
//                       onChange={(info) => {
//                         if (info.file.status === 'done') {
//                           uploadBanner.mutate({
//                             files: info.fileList.map(f => f.originFileObj),
//                             settings: { autoplay: true, autoplaySpeed: 3000 }
//                           });
//                         }
//                       }}
//                     >
//                       <p className="ant-upload-drag-icon">
//                         <UploadOutlined className="text-3xl text-blue-500" />
//                       </p>
//                       <p className="ant-upload-text">Click or drag files</p>
//                     </Upload.Dragger>
//                   </Card>
//                 </Col>
//               </Row>
//             </div>
//           </TabPane>

//           {/* ========== PRODUCTS ========== */}
       

// {/* ========== PRODUCTS - 100% WORKING WITH SEPARATE MODAL ========== */}
// <TabPane tab={<span><ShoppingOutlined /> Products</span>} key="products">
  
//   {/* Product Modal - Separate Component */}
//   <Modal
//     title="Add New Product"
//     open={productModalVisible}
//     onCancel={() => {
//       setProductModalVisible(false);
//       setProductImg([]);
//       setPC("uncategorized");
//       setProductName('');
//       setProductDesc('');
//       setProductPrice(0);
//     }}
//     onOk={async () => {
//       // Validation
//       if (!productName.trim()) {
//         toast.error('❌ Product name is required!');
//         return;
//       }
      
//       if (!productPrice || productPrice <= 0) {
//         toast.error('❌ Valid price is required!');
//         return;
//       }

//       if (!pc || pc === "uncategorized") {
//         toast.error('❌ Please select a category!');
//         return;
//       }

//       if (ProductImg.length === 0) {
//         toast.error('❌ Please upload at least one product image!');
//         return;
//       }

//       try {
//         await createProduct.mutateAsync({
//           data: {
//             name: productName.trim(),
//             description: productDesc || '',
//             price: parseFloat(productPrice),
//             category: pc
//           },
//           images: ProductImg
//         });
        
//         // Close modal and reset
//         setProductModalVisible(false);
//         setProductImg([]);
//         setPC("uncategorized");
//         setProductName('');
//         setProductDesc('');
//         setProductPrice(0);
        
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     }}
//     okText="Create Product"
//     cancelText="Cancel"
//     width={700}
//     okButtonProps={{
//       loading: createProduct.isPending,
//       style: { 
//         background: 'linear-gradient(to right, #16a34a, #0d9488)',
//         border: 'none',
//         color: 'white'
//       }
//     }}
//   >
//     <Form layout="vertical" className="mt-4">
//       <Form.Item label="Product Name" required>
//         <Input 
//           value={productName}
//           onChange={(e) => setProductName(e.target.value)}
//           placeholder="e.g., Foundation, Lipstick, etc."
//           size="large"
//         />
//       </Form.Item>
      
//       <Form.Item label="Description">
//         <TextArea 
//           value={productDesc}
//           onChange={(e) => setProductDesc(e.target.value)}
//           rows={3} 
//           placeholder="Describe your product..."
//         />
//       </Form.Item>
      
//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item label="Price ($)" required>
//             <InputNumber 
//               value={productPrice}
//               onChange={(val) => setProductPrice(val)}
//               min={0} 
//               step={0.01}
//               style={{ width: '100%' }} 
//               placeholder="0.00"
//               size="large"
//             />
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item label="Category" required>
//             <Select 
//               value={pc}
//               onChange={(val) => setPC(val)}
//               placeholder="Select category"
//               size="large"
//             >
//               <Option value="makeup">💄 Makeup</Option>
//               <Option value="skincare">🧴 Skincare</Option>
//               <Option value="tools">🪥 Tools & Brushes</Option>
//               <Option value="accessories">👛 Accessories</Option>
//             </Select>
//           </Form.Item>
//         </Col>
//       </Row>
      
//       <Form.Item 
//         label="Product Images" 
//         tooltip="Upload up to 5 images. First image will be primary."
//       >
//         <Upload
//           listType="picture-card"
//           multiple
//           maxCount={5}
//           accept="image/*"
//           fileList={ProductImg.map((file, index) => ({
//             uid: file.uid || index,
//             name: file.name,
//             status: 'done',
//             url: URL.createObjectURL(file)
//           }))}
//           beforeUpload={(file) => {
//             setProductImg(prev => [...prev, file]);
//             return false;
//           }}
//           onRemove={(file) => {
//             setProductImg(prev => prev.filter(f => 
//               f.name !== file.name || f.size !== file.size
//             ));
//           }}
//         >
//           {ProductImg.length < 5 && (
//             <div>
//               <PlusOutlined />
//               <div style={{ marginTop: 8 }}>Upload</div>
//             </div>
//           )}
//         </Upload>
//         <Text type="secondary" className="text-xs mt-2 block">
//           ✅ Selected: {ProductImg.length} image(s)
//         </Text>
//       </Form.Item>
//     </Form>
//   </Modal>

//   {/* Header */}
//   <div className="flex justify-between items-center mb-6">
//     <Title level={4}>Products ({store?.products?.length || 0})</Title>
//     <Button
//       type="primary"
//       icon={<PlusOutlined />}
//       onClick={() => {
//         // Reset all states before opening
//         setProductImg([]);
//         setPC("makeup");
//         setProductName('');
//         setProductDesc('');
//         setProductPrice(0);
//         setProductModalVisible(true);
//       }}
//       className="bg-gradient-to-r from-green-600 to-teal-600 border-0"
//     >
//       Add Product
//     </Button>
//   </div>
  
//   {/* Products Table */}
//   <Table
//     dataSource={store?.products || []}
//     rowKey={(_, i) => i}
//     columns={[
//       {
//         title: 'Product',
//         render: (_, record) => (
//           <div className="flex items-center gap-3">
//             {record.images?.[0] ? (
//               <img 
//                 src={`http://localhost:5000/${record.images[0].url.replace(/\\/g, '/')}`} 
//                 className="w-14 h-14 object-cover rounded-lg border shadow-sm"
//                 alt={record.name}
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = 'https://via.placeholder.com/56?text=No+Image';
//                 }}
//               />
//             ) : (
//               <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center border">
//                 <ShoppingOutlined className="text-gray-400 text-xl" />
//               </div>
//             )}
//             <div>
//               <div className="font-medium text-gray-800">{record.name}</div>
//               <div className="text-xs text-gray-500 mt-1 capitalize">{record.category}</div>
//               {record.images?.length > 0 && (
//                 <Tag color="blue" className="mt-1 text-xs">
//                   {record.images.length} 📸
//                 </Tag>
//               )}
//             </div>
//           </div>
//         ),
//       },
//       {
//         title: 'Price',
//         render: (_, record) => (
//           <span className="font-semibold text-lg text-green-600">
//             ${parseFloat(record.price).toFixed(2)}
//           </span>
//         ),
//       },
//       {
//         title: 'Actions',
//         render: (_, __, index) => (
//           <Popconfirm
//             title="Delete product?"
//             description="This action cannot be undone."
//             onConfirm={() => deleteProduct.mutate(index)}
//             okText="Yes"
//             cancelText="No"
//             okButtonProps={{ danger: true }}
//           >
//             <Button 
//               icon={<DeleteOutlined />} 
//               size="middle" 
//               danger 
//               className="hover:shadow-md"
//             />
//           </Popconfirm>
//         ),
//       },
//     ]}
//     pagination={false}
//     locale={{
//       emptyText: (
//         <div className="py-8">
//           <ShoppingOutlined className="text-4xl text-gray-300 mb-2" />
//           <p className="text-gray-500">No products yet. Click "Add Product" to create one.</p>
//         </div>
//       )
//     }}
//   />
// </TabPane>
 






//           {/* ========== SERVICES ========== */}
//           <TabPane tab={<span><CrownOutlined /> Services</span>} key="services">
//             <div className="space-y-6">
//               <div className="flex justify-between items-center">
//                 <Title level={4}>Services ({store?.services?.length || 0})</Title>
//                 <Button
//                   type="primary"
//                   icon={<PlusOutlined />}
//                   onClick={() => {
//                     Modal.confirm({
//                       title: 'Add Service',
//                       content: (
//                         <Form layout="vertical" className="mt-4">
//                           <Form.Item label="Service Name">
//                             <Input id="serviceName" />
//                           </Form.Item>
//                           <Form.Item label="Description">
//                             <TextArea id="serviceDesc" rows={2} />
//                           </Form.Item>
//                           <Row gutter={16}>
//                             <Col span={12}>
//                               <Form.Item label="Duration (min)">
//                                 <InputNumber id="serviceDuration" min={15} step={15} style={{ width: '100%' }} />
//                               </Form.Item>
//                             </Col>
//                             <Col span={12}>
//                               <Form.Item label="Price ($)">
//                                 <InputNumber id="servicePrice" min={0} style={{ width: '100%' }} />
//                               </Form.Item>
//                             </Col>
//                           </Row>
//                         </Form>
//                       ),
//                       onOk: () => {
//                         addService.mutate({
//                           name: document.getElementById('serviceName')?.value,
//                           description: document.getElementById('serviceDesc')?.value,
//                           duration: document.getElementById('serviceDuration')?.value,
//                           price: document.getElementById('servicePrice')?.value
//                         });
//                       }
//                     });
//                   }}
//                 >
//                   Add Service
//                 </Button>
//               </div>
              
//               <Table
//                 dataSource={store?.services || []}
//                 rowKey={(_, i) => i}
//                 columns={[
//                   {
//                     title: 'Service',
//                     dataIndex: 'name',
//                   },
//                   {
//                     title: 'Duration',
//                     render: (_, record) => `${record.duration} min`,
//                   },
//                   {
//                     title: 'Price',
//                     render: (_, record) => `$${record.price}`,
//                   },
//                   {
//                     title: 'Actions',
//                     render: (_, __, index) => (
//                       <Popconfirm
//                         title="Delete service?"
//                         onConfirm={() => deleteService.mutate(index)}
//                       >
//                         <Button icon={<DeleteOutlined />} size="small" danger />
//                       </Popconfirm>
//                     ),
//                   },
//                 ]}
//                 pagination={false}
//               />
//             </div>
//           </TabPane>

    


//  {/* ========== BUSINESS HOURS - COMPLETELY FIXED ========== */}
// <TabPane tab={<span><CalendarOutlined /> Hours</span>} key="hours">
//   <Form 
//     form={hoursForm} 
//     layout="vertical" 
//     onFinish={(v) => updateHours.mutate(v)}
//     initialValues={{
//       monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
//       tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
//       wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
//       thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
//       friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
//       saturday: { isOpen: false, openTime: '10:00', closeTime: '16:00' },
//       sunday: { isOpen: false, openTime: '10:00', closeTime: '16:00' }
//     }}
//   >
//     <Card className="shadow-sm">
//       <Title level={5} className="mb-4">Business Hours</Title>
//       <div className="space-y-3">
//         {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
//           <div key={day} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
//             <div className="w-32 font-medium capitalize pt-2">{day}</div>
            
//             <div className="flex-1">
//               {/* Switch for isOpen */}
//               <Form.Item name={[day, 'isOpen']} valuePropName="checked" noStyle>
//                 <Switch 
//                   checkedChildren="Open" 
//                   unCheckedChildren="Closed"
//                 />
//               </Form.Item>
              
//               {/* Time fields - conditionally rendered using Form.Item dependencies */}
//               <Form.Item
//                 noStyle
//                 shouldUpdate={(prevValues, currentValues) => 
//                   prevValues?.[day]?.isOpen !== currentValues?.[day]?.isOpen
//                 }
//               >
//                 {({ getFieldValue }) => {
//                   const isOpen = getFieldValue([day, 'isOpen']);
                  
//                   if (isOpen) {
//                     return (
//                       <div className="flex items-center gap-2 mt-3">
//                         <Form.Item name={[day, 'openTime']} noStyle>
//                           <Select 
//                             style={{ width: 110 }} 
//                             placeholder="Open"
//                             options={[
//                               { value: '08:00', label: '08:00' },
//                               { value: '09:00', label: '09:00' },
//                               { value: '10:00', label: '10:00' },
//                               { value: '11:00', label: '11:00' },
//                               { value: '12:00', label: '12:00' }
//                             ]}
//                           />
//                         </Form.Item>
//                         <span className="text-gray-500">—</span>
//                         <Form.Item name={[day, 'closeTime']} noStyle>
//                           <Select 
//                             style={{ width: 110 }} 
//                             placeholder="Close"
//                             options={[
//                               { value: '16:00', label: '16:00' },
//                               { value: '17:00', label: '17:00' },
//                               { value: '18:00', label: '18:00' },
//                               { value: '19:00', label: '19:00' },
//                               { value: '20:00', label: '20:00' },
//                               { value: '21:00', label: '21:00' },
//                               { value: '22:00', label: '22:00' }
//                             ]}
//                           />
//                         </Form.Item>
//                       </div>
//                     );
//                   }
                  
//                   return <span className="text-gray-400 italic ml-2 mt-2 block">Closed all day</span>;
//                 }}
//               </Form.Item>
//             </div>
//           </div>
//         ))}
//       </div>
//     </Card>
    
//     <Form.Item className="mt-6">
//       <Button 
//         type="primary" 
//         htmlType="submit"
//         loading={updateHours.isPending}
//         icon={<SaveOutlined />}
//         size="large"
//         className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
//       >
//         Save Business Hours
//       </Button>
//     </Form.Item>
//   </Form>
// </TabPane>
 







//           {/* ========== SOCIAL MEDIA ========== */}
//           <TabPane tab={<span><ShareAltOutlined /> Social</span>} key="social">
//             <Form form={socialForm} layout="vertical" onFinish={(v) => updateSocial.mutate(v.socialMedia)}>
//               <Card>
//                 <Form.List name="socialMedia">
//                   {(fields, { add, remove }) => (
//                     <>
//                       {fields.map(({ key, name, ...rest }) => (
//                         <div key={key} className="flex items-center gap-4 mb-4">
//                           <Form.Item {...rest} name={[name, 'platform']} className="w-32">
//                             <Select placeholder="Platform">
//                               <Option value="facebook">Facebook</Option>
//                               <Option value="instagram">Instagram</Option>
//                               <Option value="twitter">Twitter</Option>
//                               <Option value="youtube">YouTube</Option>
//                               <Option value="tiktok">TikTok</Option>
//                             </Select>
//                           </Form.Item>
                          
//                           <Form.Item {...rest} name={[name, 'url']} className="flex-1">
//                             <Input prefix={<LinkOutlined />} placeholder="https://..." />
//                           </Form.Item>
                          
//                           <Button icon={<DeleteOutlined />} onClick={() => remove(name)} danger />
//                         </div>
//                       ))}
                      
//                       <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
//                         Add Social Link
//                       </Button>
//                     </>
//                   )}
//                 </Form.List>
                
//                 <Button 
//                   type="primary" 
//                   htmlType="submit"
//                   className="mt-4"
//                   loading={updateSocial.isPending}
//                 >
//                   Save Social Links
//                 </Button>
//               </Card>
//             </Form>
//           </TabPane>
//         </Tabs>
//       </Card>
//     </div>
//   );
// };

// export default MemberStore;








import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, Tabs, Form, Input, Button, Space, Select, 
  Switch, Upload, Row, Col, Divider, Typography, 
  Tag, Alert, Table, Modal, InputNumber, TimePicker,
  message,
  Popconfirm
} from 'antd';
import {
  ShopOutlined, PictureOutlined, ShoppingOutlined,
  CalendarOutlined, GlobalOutlined, ShareAltOutlined,
  FileImageOutlined, PlusOutlined, DeleteOutlined,
  EditOutlined, UploadOutlined, SaveOutlined,
  LinkOutlined, MailOutlined, PhoneOutlined,
  EnvironmentOutlined, CrownOutlined,  
} from '@ant-design/icons';
 
import toast from 'react-hot-toast';
import axios from 'axios';
import dayjs from 'dayjs';
import { baseURL } from '../local/l1';
 

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const MemberStore = () => {
 
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('basic');
  const [storeForm] = Form.useForm();
  const [themeForm] = Form.useForm();
  const [hoursForm] = Form.useForm();
  const [socialForm] = Form.useForm();
  
  const user = JSON.parse(localStorage.getItem('user'));
  const [store, setStore] = useState(null);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [pc, setPC] = useState("makeup");
  const [ProductImg, setProductImg] = useState([]);
  
  const { data: storeData, isLoading, refetch } = useQuery({
    queryKey: ['store', user?._id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/stores/owner/${user._id}`);
        setStore(res.data);
        
        storeForm.setFieldsValue({
          name: res.data.name,
          description: res.data.description,
          category: res.data.category,
          contact: {
            email: res.data.contact?.email,
            phone: res.data.contact?.phone,
            website: res.data.contact?.website,
            address: {
              street: res.data.contact?.address?.street,
              city: res.data.contact?.address?.city,
              state: res.data.contact?.address?.state,
              country: res.data.contact?.address?.country,
              zipCode: res.data.contact?.address?.zipCode
            }
          }
        });

        themeForm.setFieldsValue({
          primaryColor: res.data.theme?.primaryColor,
          secondaryColor: res.data.theme?.secondaryColor,
          backgroundColor: res.data.theme?.backgroundColor,
          headerColor: res.data.theme?.headerColor,
          fontFamily: res.data.theme?.fontFamily
        });

        hoursForm.setFieldsValue(res.data.businessHours);
        socialForm.setFieldsValue({ socialMedia: res.data.socialMedia || [] });
        
        return res.data;
      } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
      }
    },
    enabled: !!user?._id
  });

  // Create store
  const createStore = useMutation({
    mutationFn: (data) => axios.post('/api/stores', { ...data, owner: user._id }),
    onSuccess: (res) => {
      setStore(res.data.store);
      toast.success('Store created successfully!');
      queryClient.invalidateQueries(['store', user._id]);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to create store')
  });

  // Update basic info
  const updateBasic = useMutation({
    mutationFn: (data) => {
      const { contact, ...rest } = data;
      return axios.put(`/api/stores/${store._id}/basic`, {
        ...rest,
        contact: contact
      });
    },
    onSuccess: () => {
      toast.success('Store updated!');
      queryClient.invalidateQueries(['store', user._id]);
    }
  });

  // Update theme
  const updateTheme = useMutation({
    mutationFn: (data) => axios.put(`/api/stores/${store._id}/theme`, data),
    onSuccess: () => {
      toast.success('Theme updated!');
      queryClient.invalidateQueries(['store', user._id]);
    }
  });

  // Upload logo
  const uploadLogo = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return axios.post(`/api/stores/${store._id}/logo`, formData);
    },
    onSuccess: () => {
      toast.success('Logo uploaded!');
      queryClient.invalidateQueries(['store', user._id]);
    }
  });

  // Upload banner
  const uploadBanner = useMutation({
    mutationFn: ({ files, settings }) => {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      formData.append('settings', JSON.stringify(settings));
      return axios.put(`/api/stores/${store._id}/banner`, formData);
    },
    onSuccess: () => {
      toast.success('Banner uploaded!');
      queryClient.invalidateQueries(['store', user._id]);
    }
  });

  // Delete banner image
  const deleteBannerImage = useMutation({
    mutationFn: (index) => axios.delete(`/api/stores/${store._id}/banner/${index}`),
    onSuccess: () => {
      toast.success('Image deleted');
      queryClient.invalidateQueries(['store', user._id]);
    }
  });

  // Create product
  const createProduct = useMutation({
    mutationFn: async ({ data, images }) => {
      const formData = new FormData();
      
      images.forEach((img) => {
        formData.append('files', img);
      });
      
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]?.toString() || '');
      });
      
      const response = await axios.post(
        `/api/stores/${store._id}/products`, 
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('✅ Product added successfully!');
      queryClient.invalidateQueries(['store', user._id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  });

  // Delete product
  const deleteProduct = useMutation({
    mutationFn: (index) => axios.delete(`/api/stores/${store._id}/products/${index}`),
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries(['store', user._id]);
    }
  });

  // Add service
  const addService = useMutation({
    mutationFn: (data) => axios.post(`/api/stores/${store._id}/services`, data),
    onSuccess: () => {
      toast.success('Service added!');
      queryClient.invalidateQueries(['store', user._id]);
    }
  });

  // Delete service
  const deleteService = useMutation({
    mutationFn: (index) => axios.delete(`/api/stores/${store._id}/services/${index}`),
    onSuccess: () => {
      toast.success('Service deleted');
      queryClient.invalidateQueries(['store', user._id]);
    }
  });

  // Update hours
  const updateHours = useMutation({
    mutationFn: (data) => axios.put(`/api/stores/${store._id}/hours`, data),
    onSuccess: () => {
      toast.success('Business hours updated!');
      queryClient.invalidateQueries(['store', user._id]);
    }
  });

  // Update social media
  const updateSocial = useMutation({
    mutationFn: (data) => axios.put(`/api/stores/${store._id}/social`, data),
    onSuccess: () => {
      toast.success('Social links updated!');
      queryClient.invalidateQueries(['store', user._id]);
    }
  });

  // If no store, show create form
  if (!storeData && !isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        <Card className="shadow-xl rounded-xl border-0">
          <div className="text-center py-8 sm:py-12">
            <ShopOutlined className="text-4xl sm:text-6xl text-gray-300 mb-4" />
            <Title level={3} className="text-xl sm:text-2xl">Create Your Store</Title>
            <Text className="text-gray-500 block mb-6 sm:mb-8 px-4">
              Start your online journey today!
            </Text>
            
            <Form
              form={storeForm}
              layout="vertical"
              onFinish={(values) => createStore.mutate(values)}
              className="max-w-2xl mx-auto px-4"
            >
              <Form.Item name="name" label="Store Name" rules={[{ required: true }]}>
                <Input size="large" placeholder="e.g., Meg's Makeup Studio" />
              </Form.Item>
              
              <Form.Item name="description" label="Description">
                <TextArea rows={4} placeholder="Tell customers about your store..." />
              </Form.Item>
              
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item name="category" label="Category">
                    <Select placeholder="Select category">
                      <Option value="beauty">Beauty & Cosmetics</Option>
                      <Option value="fashion">Fashion</Option>
                      <Option value="art">Art & Crafts</Option>
                      <Option value="services">Services</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block
                loading={createStore.isPending}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-12 text-base"
              >
                Create Store
              </Button>
            </Form>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Store Header */}
      <Card className="shadow-xl rounded-xl border-0 mb-4 sm:mb-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {store?.logo?.url ? (
              <img 
                src={`${baseURL}/${store.logo.url}`} 
                alt={store.name} 
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0" 
              />
            ) : (
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShopOutlined className="text-white text-xl sm:text-2xl" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Title level={4} className="text-base sm:text-lg md:text-xl mb-1 truncate">{store?.name}</Title>
              <Tag color="green" className="text-xs">Your Store</Tag>
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {store?.slug && (
              <Button 
                icon={<GlobalOutlined />}
                onClick={() => window.open(`/store/${store.slug}`, '_blank')}
                className="flex-1 sm:flex-none text-sm"
                size="middle"
              >
                <span className="hidden sm:inline">View Store</span>
                <span className="sm:hidden">View</span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Main Tabs */}
      <Card className="shadow-xl rounded-xl border-0 overflow-x-hidden">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
           
          className="mobile-tabs"
          renderTabBar={(props, DefaultTabBar) => (
            <div className="overflow-x-auto pb-2 mb-2 scrollbar-hide">
              <DefaultTabBar {...props} className="flex-nowrap min-w-max" />
            </div>
          )}
        >
          
          {/* ========== BASIC INFO ========== */}
          <TabPane tab={<span><ShopOutlined className="text-base" /> <span className="!hidden sm:inline">Basic Info</span></span>} key="basic">
            <Form form={storeForm} layout="vertical" onFinish={(v) => updateBasic.mutate(v)}>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Form.Item name="name" label="Store Name" rules={[{ required: true }]}>
                    <Input size="large" className="text-base" />
                  </Form.Item>
                  
                  <Form.Item name="description" label="Description">
                    <TextArea rows={4} className="text-base" />
                  </Form.Item>
                  
                  <Form.Item name="category" label="Category">
                    <Select className="text-base">
                      <Option value="beauty">Beauty & Cosmetics</Option>
                      <Option value="fashion">Fashion</Option>
                      <Option value="art">Art & Crafts</Option>
                      <Option value="services">Services</Option>
                    </Select>
                  </Form.Item>
                  
                  <Divider className="text-sm">Contact Information</Divider>
                  
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['contact', 'email']} label="Email">
                        <Input prefix={<MailOutlined />} className="text-base" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name={['contact', 'phone']} label="Phone">
                        <Input prefix={<PhoneOutlined />} className="text-base" />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item name={['contact', 'website']} label="Website">
                        <Input prefix={<GlobalOutlined />} className="text-base" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Divider className="text-sm">Address</Divider>
                  
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={16}>
                      <Form.Item name={['contact', 'address', 'street']} label="Street">
                        <Input prefix={<EnvironmentOutlined />} className="text-base" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item name={['contact', 'address', 'city']} label="City">
                        <Input className="text-base" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item name={['contact', 'address', 'country']} label="Country">
                        <Input className="text-base" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item name={['contact', 'address', 'zipCode']} label="Zip Code">
                        <Input className="text-base" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                
                <Col xs={24} lg={8}>
                  <Card className="bg-gray-50 h-full">
                    <div className="text-center">
                      <Title level={5} className="text-base">Store Logo</Title>
                      <div className="my-4 flex justify-center">
                        {store?.logo?.url ? (
                          <img 
                            src={`${baseURL}/${store.logo.url}`} 
                            alt="Logo" 
                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg" 
                          />
                        ) : (
                          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FileImageOutlined className="text-3xl sm:text-4xl text-gray-400" />
                          </div>
                        )}
                      </div>
                      <Upload
                        customRequest={({ file }) => uploadLogo.mutate(file)}
                        showUploadList={false}
                      >
                        <Button 
                          icon={<UploadOutlined />} 
                          block 
                          loading={uploadLogo.isPending}
                          className="text-sm"
                          size="large"
                        >
                          Upload Logo
                        </Button>
                      </Upload>
                    </div>
                  </Card>
                </Col>
              </Row>
              
              <Form.Item className="mt-4 sm:mt-6">
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={updateBasic.isPending}
                  icon={<SaveOutlined />}
                  className="bg-gradient-to-r from-green-600 to-teal-600 w-full sm:w-auto text-base h-10 sm:h-11"
                  size="large"
                >
                  Save Basic Info
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* ========== THEME ========== */}
          <TabPane tab={<span><CrownOutlined className="text-base" /> <span className="hidden sm:inline">Theme</span></span>} key="theme">
            <Form form={themeForm} layout="vertical" onFinish={(v) => updateTheme.mutate(v)}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card className="h-full">
                    <Title level={5} className="text-base mb-4">Colors</Title>
                    
                    <Form.Item name="primaryColor" label="Primary Color">
                      <Input type="color" className="w-full h-10 p-1" />
                    </Form.Item>
                    
                    <Form.Item name="secondaryColor" label="Secondary Color">
                      <Input type="color" className="w-full h-10 p-1" />
                    </Form.Item>
                    
                    <Form.Item name="backgroundColor" label="Background Color">
                      <Input type="color" className="w-full h-10 p-1" />
                    </Form.Item>
                    
                    <Form.Item name="headerColor" label="Header Color">
                      <Input type="color" className="w-full h-10 p-1" />
                    </Form.Item>
                  </Card>
                </Col>
                
                <Col xs={24} md={12}>
                  <Card className="h-full">
                    <Title level={5} className="text-base mb-4">Typography</Title>
                    
                    <Form.Item name="fontFamily" label="Font">
                      <Select className="text-base">
                        <Option value="Inter">Inter</Option>
                        <Option value="Poppins">Poppins</Option>
                        <Option value="Roboto">Roboto</Option>
                        <Option value="Montserrat">Montserrat</Option>
                      </Select>
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
              
              <Form.Item className="mt-4 sm:mt-6">
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={updateTheme.isPending}
                  icon={<SaveOutlined />}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto text-base h-10 sm:h-11"
                  size="large"
                >
                  Save Theme
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* ========== BANNER ========== */}
          <TabPane tab={<span><PictureOutlined className="text-base" /> <span className="hidden sm:inline">Banner</span></span>} key="banner">
            <div className="space-y-4 sm:space-y-6">
              <Alert 
                message="Upload banner images for your store slider" 
                type="info" 
                showIcon 
                className="text-sm"
              />
              
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Card title={<span className="text-base">Current Banner Images</span>}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      {store?.banner?.media?.map((media, index) => (
                        <div key={index} className="relative group aspect-w-16 aspect-h-9">
                          <img 
                            src={`${baseURL}/${media.url}`}
                            alt={media.alt}
                            className="w-full h-24 sm:h-32 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Button 
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => deleteBannerImage.mutate(index)}
                              loading={deleteBannerImage.isPending}
                              size="small"
                              className="text-xs"
                            />
                          </div>
                        </div>
                      ))}
                      
                      {(!store?.banner?.media || store.banner.media.length === 0) && (
                        <div className="col-span-2 sm:col-span-3 text-center py-6 sm:py-8">
                          <PictureOutlined className="text-3xl sm:text-4xl text-gray-300 mb-2" />
                          <Text type="secondary" className="text-sm">No banner images yet</Text>
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} lg={8}>
                  <Card className="bg-gray-50 h-full">
                    <Title level={5} className="text-base mb-4">Upload New Banner</Title>
                    <Upload.Dragger
                      multiple
                      customRequest={({ file, onSuccess }) => {
                        setTimeout(() => onSuccess('ok'), 0);
                      }}
                      onChange={(info) => {
                        if (info.file.status === 'done') {
                          uploadBanner.mutate({
                            files: info.fileList.map(f => f.originFileObj),
                            settings: { autoplay: true, autoplaySpeed: 3000 }
                          });
                        }
                      }}
                      className="text-sm"
                    >
                      <p className="ant-upload-drag-icon">
                        <UploadOutlined className="text-2xl sm:text-3xl text-blue-500" />
                      </p>
                      <p className="ant-upload-text text-sm">Click or drag files</p>
                    </Upload.Dragger>
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>

          {/* ========== PRODUCTS ========== */}
          <TabPane tab={<span><ShoppingOutlined className="text-base" /> <span className="hidden sm:inline">Products</span></span>} key="products">
            
            {/* Product Modal */}
            <Modal
              title={<span className="text-base sm:text-lg">Add New Product</span>}
              open={productModalVisible}
              onCancel={() => {
                setProductModalVisible(false);
                setProductImg([]);
                setPC("makeup");
                setProductName('');
                setProductDesc('');
                setProductPrice(0);
              }}
              onOk={async () => {
                if (!productName.trim()) {
                  toast.error('❌ Product name is required!');
                  return;
                }
                
                if (!productPrice || productPrice <= 0) {
                  toast.error('❌ Valid price is required!');
                  return;
                }

                if (!pc || pc === "uncategorized") {
                  toast.error('❌ Please select a category!');
                  return;
                }

                if (ProductImg.length === 0) {
                  toast.error('❌ Please upload at least one product image!');
                  return;
                }

                try {
                  await createProduct.mutateAsync({
                    data: {
                      name: productName.trim(),
                      description: productDesc || '',
                      price: parseFloat(productPrice),
                      category: pc
                    },
                    images: ProductImg
                  });
                  
                  setProductModalVisible(false);
                  setProductImg([]);
                  setPC("makeup");
                  setProductName('');
                  setProductDesc('');
                  setProductPrice(0);
                  
                } catch (error) {
                  console.error('Error:', error);
                }
              }}
              okText="Create Product"
              cancelText="Cancel"
              width="95%"
              style={{ maxWidth: '700px', top: 20 }}
              okButtonProps={{
                loading: createProduct.isPending,
                style: { 
                  background: 'linear-gradient(to right, #16a34a, #0d9488)',
                  border: 'none',
                  color: 'white'
                },
                className: 'text-sm sm:text-base'
              }}
              cancelButtonProps={{
                className: 'text-sm sm:text-base'
              }}
            >
              <Form layout="vertical" className="mt-4">
                <Form.Item label={<span className="text-sm sm:text-base">Product Name</span>} required>
                  <Input 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Foundation, Lipstick, etc."
                    size="large"
                    className="text-sm sm:text-base"
                  />
                </Form.Item>
                
                <Form.Item label={<span className="text-sm sm:text-base">Description</span>}>
                  <TextArea 
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    rows={3} 
                    placeholder="Describe your product..."
                    className="text-sm sm:text-base"
                  />
                </Form.Item>
                
                <Row gutter={[12, 12]}>
                  <Col xs={24} sm={12}>
                    <Form.Item label={<span className="text-sm sm:text-base">Price ($)</span>} required>
                      <InputNumber 
                        value={productPrice}
                        onChange={(val) => setProductPrice(val)}
                        min={0} 
                        step={0.01}
                        style={{ width: '100%' }} 
                        placeholder="0.00"
                        size="large"
                        className="text-sm sm:text-base"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label={<span className="text-sm sm:text-base">Category</span>} required>
                      <Select 
                        value={pc}
                        onChange={(val) => setPC(val)}
                        placeholder="Select category"
                        size="large"
                        className="text-sm sm:text-base"
                      >
                        <Option value="makeup">💄 Makeup</Option>
                        <Option value="skincare">🧴 Skincare</Option>
                        <Option value="tools">🪥 Tools & Brushes</Option>
                        <Option value="accessories">👛 Accessories</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item 
                  label={<span className="text-sm sm:text-base">Product Images</span>}
                  tooltip="Upload up to 5 images. First image will be primary."
                >
                  <Upload
                    listType="picture-card"
                    multiple
                    maxCount={5}
                    accept="image/*"
                    fileList={ProductImg.map((file, index) => ({
                      uid: file.uid || index,
                      name: file.name,
                      status: 'done',
                      url: URL.createObjectURL(file)
                    }))}
                    beforeUpload={(file) => {
                      setProductImg(prev => [...prev, file]);
                      return false;
                    }}
                    onRemove={(file) => {
                      setProductImg(prev => prev.filter(f => 
                        f.name !== file.name || f.size !== file.size
                      ));
                    }}
                    className="product-upload"
                  >
                    {ProductImg.length < 5 && (
                      <div className="flex flex-col items-center">
                        <PlusOutlined className="text-lg" />
                        <div className="mt-1 text-xs">Upload</div>
                      </div>
                    )}
                  </Upload>
                  <Text type="secondary" className="text-xs mt-2 block">
                    ✅ Selected: {ProductImg.length} image(s)
                  </Text>
                </Form.Item>
              </Form>
            </Modal>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
              <Title level={4} className="text-base sm:text-lg mb-0">Products ({store?.products?.length || 0})</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setProductImg([]);
                  setPC("makeup");
                  setProductName('');
                  setProductDesc('');
                  setProductPrice(0);
                  setProductModalVisible(true);
                }}
                className="bg-gradient-to-r from-green-600 to-teal-600 border-0 w-full sm:w-auto text-sm sm:text-base"
                size="large"
              >
                Add Product
              </Button>
            </div>
            
            {/* Products Table */}
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <Table
                dataSource={store?.products || []}
                rowKey={(_, i) => i}
                columns={[
                  {
                    title: 'Product',
                    width: '60%',
                    render: (_, record) => (
                      <div className="flex items-center gap-2 sm:gap-3 min-w-[200px]">
                        {record.images?.[0] ? (
                          <img 
                            src={`${baseURL}/${record.images[0].url.replace(/\\/g, '/')}`} 
                            className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-lg border shadow-sm flex-shrink-0"
                            alt={record.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/56?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-100 rounded-lg flex items-center justify-center border flex-shrink-0">
                            <ShoppingOutlined className="text-gray-400 text-base sm:text-xl" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-gray-800 text-sm sm:text-base truncate">{record.name}</div>
                          <div className="text-xs text-gray-500 mt-1 capitalize truncate">{record.category}</div>
                          {record.images?.length > 0 && (
                            <Tag color="blue" className="mt-1 text-xs hidden sm:inline-block">
                              {record.images.length} 📸
                            </Tag>
                          )}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: 'Price',
                    width: '20%',
                    render: (_, record) => (
                      <span className="font-semibold text-sm sm:text-base text-green-600 whitespace-nowrap">
                        ${parseFloat(record.price).toFixed(2)}
                      </span>
                    ),
                  },
                  {
                    title: 'Actions',
                    width: '20%',
                    render: (_, __, index) => (
                      <Popconfirm
                        title="Delete product?"
                        description="This action cannot be undone."
                        onConfirm={() => deleteProduct.mutate(index)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                      >
                        <Button 
                          icon={<DeleteOutlined />} 
                          size="middle" 
                          danger 
                          className="hover:shadow-md text-sm"
                        />
                      </Popconfirm>
                    ),
                  },
                ]}
                pagination={false}
                scroll={{ x: true }}
                size="middle"
                locale={{
                  emptyText: (
                    <div className="py-6 sm:py-8">
                      <ShoppingOutlined className="text-3xl sm:text-4xl text-gray-300 mb-2" />
                      <p className="text-gray-500 text-sm">No products yet. Click "Add Product" to create one.</p>
                    </div>
                  )
                }}
                className="text-sm"
              />
            </div>
          </TabPane>

          {/* ========== SERVICES ========== */}
          <TabPane tab={<span><CrownOutlined className="text-base" /> <span className="hidden sm:inline">Services</span></span>} key="services">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <Title level={4} className="text-base sm:text-lg mb-0">Services ({store?.services?.length || 0})</Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: <span className="text-base">Add Service</span>,
                      content: (
                        <Form layout="vertical" className="mt-4">
                          <Form.Item label={<span className="text-sm">Service Name</span>}>
                            <Input id="serviceName" className="text-sm" />
                          </Form.Item>
                          <Form.Item label={<span className="text-sm">Description</span>}>
                            <TextArea id="serviceDesc" rows={2} className="text-sm" />
                          </Form.Item>
                          <Row gutter={12}>
                            <Col span={12}>
                              <Form.Item label={<span className="text-sm">Duration (min)</span>}>
                                <InputNumber id="serviceDuration" min={15} step={15} style={{ width: '100%' }} className="text-sm" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item label={<span className="text-sm">Price ($)</span>}>
                                <InputNumber id="servicePrice" min={0} style={{ width: '100%' }} className="text-sm" />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Form>
                      ),
                      onOk: () => {
                        addService.mutate({
                          name: document.getElementById('serviceName')?.value,
                          description: document.getElementById('serviceDesc')?.value,
                          duration: document.getElementById('serviceDuration')?.value,
                          price: document.getElementById('servicePrice')?.value
                        });
                      },
                      width: '95%',
                      style: { maxWidth: '500px', top: 20 },
                      okButtonProps: { className: 'text-sm' },
                      cancelButtonProps: { className: 'text-sm' }
                    });
                  }}
                  className="w-full sm:w-auto text-sm sm:text-base"
                  size="large"
                >
                  Add Service
                </Button>
              </div>
              
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <Table
                  dataSource={store?.services || []}
                  rowKey={(_, i) => i}
                  columns={[
                    {
                      title: 'Service',
                      dataIndex: 'name',
                      width: '40%',
                      className: 'text-sm',
                    },
                    {
                      title: 'Duration',
                      width: '30%',
                      render: (_, record) => <span className="text-sm whitespace-nowrap">{record.duration} min</span>,
                    },
                    {
                      title: 'Price',
                      width: '30%',
                      render: (_, record) => <span className="text-sm font-semibold whitespace-nowrap">${record.price}</span>,
                    },
                    {
                      title: 'Actions',
                      width: '80px',
                      render: (_, __, index) => (
                        <Popconfirm
                          title="Delete service?"
                          onConfirm={() => deleteService.mutate(index)}
                          okButtonProps={{ className: 'text-sm' }}
                          cancelButtonProps={{ className: 'text-sm' }}
                        >
                          <Button icon={<DeleteOutlined />} size="small" danger className="text-xs" />
                        </Popconfirm>
                      ),
                    },
                  ]}
                  pagination={false}
                  scroll={{ x: true }}
                  size="small"
                  className="text-sm"
                />
              </div>
            </div>
          </TabPane>

          {/* ========== BUSINESS HOURS ========== */}
          <TabPane tab={<span><CalendarOutlined className="text-base" /> <span className="hidden sm:inline">Hours</span></span>} key="hours">
            <Form 
              form={hoursForm} 
              layout="vertical" 
              onFinish={(v) => updateHours.mutate(v)}
              initialValues={{
                monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
                tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
                wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
                thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
                friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
                saturday: { isOpen: false, openTime: '10:00', closeTime: '16:00' },
                sunday: { isOpen: false, openTime: '10:00', closeTime: '16:00' }
              }}
            >
              <Card className="shadow-sm">
                <Title level={5} className="text-base mb-3 sm:mb-4">Business Hours</Title>
                <div className="space-y-2 sm:space-y-3">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <div className="w-full sm:w-32 font-medium capitalize text-sm sm:text-base pt-1 sm:pt-2">{day}</div>
                      
                      <div className="flex-1">
                        <Form.Item name={[day, 'isOpen']} valuePropName="checked" noStyle>
                          <Switch 
                            checkedChildren="Open" 
                            unCheckedChildren="Closed"
                            className="text-xs"
                          />
                        </Form.Item>
                        
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) => 
                            prevValues?.[day]?.isOpen !== currentValues?.[day]?.isOpen
                          }
                        >
                          {({ getFieldValue }) => {
                            const isOpen = getFieldValue([day, 'isOpen']);
                            
                            if (isOpen) {
                              return (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 sm:mt-3">
                                  <Form.Item name={[day, 'openTime']} noStyle>
                                    <Select 
                                      style={{ width: '100%', maxWidth: '110px' }} 
                                      placeholder="Open"
                                      className="text-sm"
                                      options={[
                                        { value: '08:00', label: '08:00' },
                                        { value: '09:00', label: '09:00' },
                                        { value: '10:00', label: '10:00' },
                                        { value: '11:00', label: '11:00' },
                                        { value: '12:00', label: '12:00' }
                                      ]}
                                    />
                                  </Form.Item>
                                  <span className="text-gray-500 mx-1 hidden sm:inline">—</span>
                                  <span className="text-gray-500 mx-1 sm:hidden">to</span>
                                  <Form.Item name={[day, 'closeTime']} noStyle>
                                    <Select 
                                      style={{ width: '100%', maxWidth: '110px' }} 
                                      placeholder="Close"
                                      className="text-sm"
                                      options={[
                                        { value: '16:00', label: '16:00' },
                                        { value: '17:00', label: '17:00' },
                                        { value: '18:00', label: '18:00' },
                                        { value: '19:00', label: '19:00' },
                                        { value: '20:00', label: '20:00' },
                                        { value: '21:00', label: '21:00' },
                                        { value: '22:00', label: '22:00' }
                                      ]}
                                    />
                                  </Form.Item>
                                </div>
                              );
                            }
                            
                            return <span className="text-gray-400 italic text-xs sm:text-sm ml-0 sm:ml-2 mt-1 block">Closed all day</span>;
                          }}
                        </Form.Item>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Form.Item className="mt-4 sm:mt-6">
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={updateHours.isPending}
                  icon={<SaveOutlined />}
                  size="large"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 w-full sm:w-auto text-sm sm:text-base h-10 sm:h-11"
                >
                  Save Business Hours
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* ========== SOCIAL MEDIA ========== */}
          <TabPane tab={<span><ShareAltOutlined className="text-base" /> <span className="hidden sm:inline">Social</span></span>} key="social">
            <Form form={socialForm} layout="vertical" onFinish={(v) => updateSocial.mutate(v.socialMedia)}>
              <Card>
                <Form.List name="socialMedia">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...rest }) => (
                        <div key={key} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                          <Form.Item {...rest} name={[name, 'platform']} className="w-full sm:w-32 mb-0">
                            <Select placeholder="Platform" className="text-sm">
                              <Option value="facebook">Facebook</Option>
                              <Option value="instagram">Instagram</Option>
                              <Option value="twitter">Twitter</Option>
                              <Option value="youtube">YouTube</Option>
                              <Option value="tiktok">TikTok</Option>
                            </Select>
                          </Form.Item>
                          
                          <Form.Item {...rest} name={[name, 'url']} className="flex-1 w-full sm:w-auto mb-0">
                            <Input prefix={<LinkOutlined />} placeholder="https://..." className="text-sm" />
                          </Form.Item>
                          
                          <Button 
                            icon={<DeleteOutlined />} 
                            onClick={() => remove(name)} 
                            danger 
                            className="w-full sm:w-auto text-sm"
                          />
                        </div>
                      ))}
                      
                      <Button 
                        type="dashed" 
                        onClick={() => add()} 
                        block 
                        icon={<PlusOutlined />}
                        className="text-sm h-10"
                      >
                        Add Social Link
                      </Button>
                    </>
                  )}
                </Form.List>
                
                <Button 
                  type="primary" 
                  htmlType="submit"
                  className="mt-4 w-full sm:w-auto text-sm h-10"
                  loading={updateSocial.isPending}
                  size="large"
                >
                  Save Social Links
                </Button>
              </Card>
            </Form>
          </TabPane>
        </Tabs>
      </Card>

      {/* Add custom CSS for better mobile experience */}
      <style jsx>{`
        @media (max-width: 640px) {
          .ant-tabs-tab {
            padding: 8px 12px !important;
            margin: 0 !important;
          }
          .ant-tabs-tab .anticon {
            font-size: 18px !important;
          }
          .ant-tabs-content-holder {
            padding: 0 !important;
          }
          .ant-card-body {
            padding: 16px !important;
          }
          .ant-form-item {
            margin-bottom: 16px !important;
          }
          .ant-table {
            font-size: 13px !important;
          }
          .ant-modal-body {
            max-height: 70vh;
            overflow-y: auto;
            padding: 16px !important;
          }
          .ant-upload-list-picture-card {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 8px;
          }
          .ant-upload.ant-upload-select-picture-card {
            width: 80px;
            height: 80px;
            margin: 0;
          }
          .ant-upload-list-picture-card .ant-upload-list-item {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default MemberStore;