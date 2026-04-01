import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useToast,
  Flex,
  Text,
  VStack,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiTrash2, FiEdit2, FiPlus } from 'react-icons/fi';
import { eventsAPI, categoryAPI, adminAPI, registrationsAPI } from '../services/api';

const MotionBox = motion(Box);

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, categoriesRes] = await Promise.all([
        eventsAPI.getAll({ limit: 100 }),
        categoryAPI.getAll()
      ]);
      if (eventsRes.success) setEvents(eventsRes.data?.events || eventsRes.data || []);
      if (categoriesRes.success) setCategories(categoriesRes.data || []);
    } catch (error) {
      toast({ title: 'Error fetching data', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handleApprove = async (id) => {
    try {
      await adminAPI.approveEvent(id);
      toast({ title: 'Event approved', status: 'success' });
      fetchData();
    } catch (error) {
      toast({ title: 'Failed to approve', status: 'error' });
    }
  };

  const handleReject = async (id) => {
    try {
      await adminAPI.rejectEvent(id);
      toast({ title: 'Event rejected', status: 'success' });
      fetchData();
    } catch (error) {
      toast({ title: 'Failed to reject', status: 'error' });
    }
  };

  // Category Handlers
  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, categoryForm);
        toast({ title: 'Category updated', status: 'success' });
      } else {
        await categoryAPI.create(categoryForm);
        toast({ title: 'Category created', status: 'success' });
      }
      onClose();
      fetchData();
    } catch (error) {
      toast({ title: 'Failed to save category', status: 'error' });
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categoryAPI.delete(id);
      toast({ title: 'Category deleted', status: 'success' });
      fetchData();
    } catch (error) {
      toast({ title: 'Failed to delete category', status: 'error' });
    }
  };

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({ name: category.name, description: category.description });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '' });
    }
    onOpen();
  };

  const handleDownloadCSV = async (eventId) => {
    try {
      const blob = await registrationsAPI.exportAttendees(eventId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendees-${eventId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({ title: 'Failed to download CSV', status: 'error' });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Heading mb={6}>Admin Dashboard</Heading>

        <Box className="glass-card" p={6} borderRadius="xl" bg="white" color="gray.800">
          <Tabs variant="soft-rounded" colorScheme="brand">
            <TabList mb={6}>
              <Tab color="gray.800">Events Approval</Tab>
              <Tab color="gray.800">Categories</Tab>
            </TabList>

            <TabPanels>
              {/* Events Approval Tab */}
              <TabPanel>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th color="gray.600">Title</Th>
                      <Th color="gray.600">Creator</Th>
                      <Th color="gray.600">Status</Th>
                      <Th color="gray.600">Attendees</Th>
                      <Th color="gray.600">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {events.map(event => (
                      <Tr key={event._id}>
                        <Td>{event.title}</Td>
                        <Td>{event.createdBy?.username || 'Unknown'}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              event.status === 'approved' ? 'green' :
                                event.status === 'pending' ? 'yellow' : 'red'
                            }
                          >
                            {event.status}
                          </Badge>
                        </Td>
                        <Td>
                           {/* Using the mock capacity info roughly here or API fetch if detailed needed */}
                           <Button size="xs" colorScheme="brand" onClick={() => handleDownloadCSV(event._id)}>
                             Export CSV
                           </Button>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            {event.status === 'pending' && (
                              <>
                                <IconButton
                                  icon={<FiCheck />}
                                  size="sm"
                                  colorScheme="green"
                                  aria-label="Approve"
                                  onClick={() => handleApprove(event._id)}
                                />
                                <IconButton
                                  icon={<FiX />}
                                  size="sm"
                                  colorScheme="red"
                                  aria-label="Reject"
                                  onClick={() => handleReject(event._id)}
                                />
                              </>
                            )}
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TabPanel>

              {/* Categories Tab */}
              <TabPanel>
                <Flex justify="space-between" mb={4}>
                  <Heading size="md">Manage Categories</Heading>
                  <Button leftIcon={<FiPlus />} colorScheme="brand" onClick={() => openCategoryModal()}>
                    Add Category
                  </Button>
                </Flex>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th color="gray.600">Name</Th>
                      <Th color="gray.600">Description</Th>
                      <Th color="gray.600">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {categories.map(cat => (
                      <Tr key={cat._id}>
                        <Td>{cat.name}</Td>
                        <Td>{cat.description}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              icon={<FiEdit2 />}
                              size="sm"
                              colorScheme="brand"
                              variant="ghost"
                              onClick={() => openCategoryModal(cat)}
                            />
                            <IconButton
                              icon={<FiTrash2 />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleDeleteCategory(cat._id)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </MotionBox>

      {/* Category Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="white" color="gray.800">
          <ModalHeader>{editingCategory ? 'Edit Category' : 'New Category'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="brand" onClick={handleSaveCategory}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
