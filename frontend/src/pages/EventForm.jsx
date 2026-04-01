import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Flex,
  useToast,
  Image,
  Card,
  CardBody,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import { eventsAPI } from '../services/api';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const EventForm = () => {
  const { id } = useParams(); // If id exists, we're in edit mode
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    start_time: '',
    end_time: '',
    registration_deadline: '',
    max_attendees: '',
    price: 'Free',
    website: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      const fetchEvent = async () => {
        try {
          const res = await eventsAPI.getById(id);
          if (res.success) {
            const e = res.data;
            setFormData({
              title: e.title || '',
              description: e.description || '',
              category: e.category || '',
              location: typeof e.location === 'string' ? e.location : e.location?.address || '',
              date: e.date ? new Date(e.date).toISOString().slice(0, 16) : '',
              start_time: e.start_time ? new Date(e.start_time).toISOString().slice(0, 16) : '',
              end_time: e.end_time ? new Date(e.end_time).toISOString().slice(0, 16) : '',
              registration_deadline: e.registration_deadline ? new Date(e.registration_deadline).toISOString().slice(0, 16) : '',
              max_attendees: e.max_attendees || '',
              price: e.price || 'Free',
              website: e.website || '',
            });
            if (e.image) setImagePreview(e.image);
          }
        } catch (err) {
          toast({ title: 'Failed to load event', status: 'error', duration: 3000 });
          navigate('/');
        }
      };
      fetchEvent();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (!formData.description || formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.date && !formData.start_time) newErrors.date = 'Event date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        // Use start_time as date if date is not set
        date: formData.date || formData.start_time,
      };

      // Remove empty fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '') delete submitData[key];
      });

      let res;
      if (isEdit) {
        res = await eventsAPI.update(id, submitData, imageFile);
      } else {
        res = await eventsAPI.create(submitData, imageFile);
      }

      if (res.success) {
        toast({
          title: isEdit ? 'Event updated!' : 'Event created!',
          status: 'success',
          duration: 3000,
        });
        navigate('/');
      }
    } catch (err) {
      toast({
        title: isEdit ? 'Failed to update event' : 'Failed to create event',
        description: err.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Button
        leftIcon={<FiArrowLeft />}
        variant="ghost"
        mb={6}
        onClick={() => navigate(-1)}
        color="gray.600"
        _hover={{ color: 'brand.600' }}
      >
        Back
      </Button>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card">
          <CardBody p={8}>
            <Heading size="lg" mb={6}>
              {isEdit ? 'Edit Event' : 'Create New Event'}
            </Heading>

            <form onSubmit={handleSubmit}>
              <VStack spacing={5} align="stretch">
                {/* Title */}
                <FormControl isRequired isInvalid={errors.title}>
                  <FormLabel>Event Title</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                    size="lg"
                  />
                  <FormErrorMessage>{errors.title}</FormErrorMessage>
                </FormControl>

                {/* Category */}
                <FormControl isRequired isInvalid={errors.category}>
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Select category"
                  >
                    <option value="academic">Academic</option>
                    <option value="social">Social</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                    <option value="career">Career</option>
                    <option value="other">Other</option>
                  </Select>
                  <FormErrorMessage>{errors.category}</FormErrorMessage>
                </FormControl>

                {/* Description */}
                <FormControl isRequired isInvalid={errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your event..."
                    rows={6}
                  />
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </FormControl>

                {/* Location */}
                <FormControl isRequired isInvalid={errors.location}>
                  <FormLabel>Venue / Location</FormLabel>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Main Auditorium, Alliance University"
                  />
                  <FormErrorMessage>{errors.location}</FormErrorMessage>
                </FormControl>

                {/* Date & Time */}
                <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                  <FormControl isRequired isInvalid={errors.date}>
                    <FormLabel>Start Date & Time</FormLabel>
                    <Input
                      name="start_time"
                      type="datetime-local"
                      value={formData.start_time}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.date}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>End Date & Time</FormLabel>
                    <Input
                      name="end_time"
                      type="datetime-local"
                      value={formData.end_time}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Flex>

                {/* Registration Details */}
                <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                  <FormControl>
                    <FormLabel>Registration Deadline</FormLabel>
                    <Input
                      name="registration_deadline"
                      type="datetime-local"
                      value={formData.registration_deadline}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Max Attendees</FormLabel>
                    <NumberInput min={1}>
                      <NumberInputField
                        name="max_attendees"
                        value={formData.max_attendees}
                        onChange={handleChange}
                        placeholder="No limit"
                      />
                    </NumberInput>
                  </FormControl>
                </Flex>

                {/* Price & Website */}
                <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                  <FormControl>
                    <FormLabel>Price</FormLabel>
                    <Input
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Free"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Website URL</FormLabel>
                    <Input
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </FormControl>
                </Flex>

                {/* Image Upload */}
                <FormControl>
                  <FormLabel>Event Poster</FormLabel>
                  <Box
                    border="2px dashed"
                    borderColor="gray.200"
                    borderRadius="lg"
                    p={6}
                    textAlign="center"
                    cursor="pointer"
                    _hover={{ borderColor: 'brand.500' }}
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        maxH="200px"
                        mx="auto"
                        borderRadius="md"
                      />
                    ) : (
                      <VStack spacing={2}>
                        <FiUpload size={24} color="#718096" />
                        <Text color="gray.600">Click to upload event poster</Text>
                        <Text fontSize="xs" color="gray.500">PNG, JPG up to 10MB</Text>
                      </VStack>
                    )}
                  </Box>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    display="none"
                  />
                </FormControl>

                {/* Submit */}
                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  isLoading={loading}
                  loadingText={isEdit ? 'Updating...' : 'Creating...'}
                >
                  {isEdit ? 'Update Event' : 'Create Event'}
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </MotionBox>
    </Container>
  );
};

export default EventForm;
