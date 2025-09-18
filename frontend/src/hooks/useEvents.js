import { useState, useEffect, useCallback } from 'react';
import { eventsAPI } from '../services/api';
import { useToast } from '@chakra-ui/react';

const useEvents = (initialFilters = {}) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const toast = useToast();

  const fetchEvents = useCallback(async (page = 1, limit = 12, filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit,
        ...filterParams
      };
      
      const response = await eventsAPI.getAll(params);
      
      if (response.success) {
        setEvents(response.data.events);
        setFilteredEvents(response.data.events);
        setPagination({
          page: response.data.currentPage,
          limit: response.data.limit,
          total: response.data.totalEvents,
          totalPages: response.data.totalPages
        });
      } else {
        throw new Error(response.message || 'Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load events. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const searchEvents = useCallback(async (query) => {
    try {
      setLoading(true);
      const response = await eventsAPI.search(query);
      
      if (response.success) {
        setFilteredEvents(response.data);
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (err) {
      console.error('Error searching events:', err);
      setError(err.message);
      toast({
        title: 'Search Error',
        description: 'Failed to search events. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    
    let filtered = events;
    
    // Category filter
    if (newFilters.category) {
      filtered = filtered.filter(event => 
        event.category === newFilters.category
      );
    }
    
    // Date filter
    if (newFilters.date) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        const filterDate = new Date(newFilters.date);
        return eventDate.toDateString() === filterDate.toDateString();
      });
    }
    
    // Search filter
    if (newFilters.search) {
      const searchTerm = newFilters.search.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Saved events filter
    if (newFilters.saved) {
      filtered = filtered.filter(event => event.isSaved);
    }
    
    // Price filter
    if (newFilters.price) {
      if (newFilters.price === 'free') {
        filtered = filtered.filter(event => event.price === 'Free' || !event.price);
      } else if (newFilters.price === 'paid') {
        filtered = filtered.filter(event => event.price && event.price !== 'Free');
      }
    }
    
    // Location filter
    if (newFilters.location) {
      filtered = filtered.filter(event => {
        const location = typeof event.location === 'object' ? event.location.address : event.location;
        return location.toLowerCase().includes(newFilters.location.toLowerCase());
      });
    }
    
    setFilteredEvents(filtered);
  }, [events]);

  const refreshEvents = useCallback(() => {
    fetchEvents(pagination.page, pagination.limit, filters);
  }, [fetchEvents, pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    applyFilters(filters);
  }, [events, filters, applyFilters]);

  return {
    events: filteredEvents,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    applyFilters,
    searchEvents,
    fetchEvents: refreshEvents,
    refetch: refreshEvents
  };
};

export default useEvents;