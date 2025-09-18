import { motion } from 'framer-motion';
import { Flex, Text, Heading, Button, Card } from '@chakra-ui/react';

// Page transitions
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

// Stagger children animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Fade animations
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

// Scale animations
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 },
};

export const hoverLift = {
  y: -5,
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  transition: { duration: 0.2 },
};

// Button animations
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

export const buttonTap = {
  scale: 0.98,
};

// Card animations
export const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const cardHover = {
  y: -5,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  transition: { duration: 0.2 },
};

// List animations
export const listContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const listItem = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

// Export motion components
export const MotionBox = motion.div;
export const MotionFlex = motion(Flex);
export const MotionText = motion(Text);
export const MotionHeading = motion(Heading);
export const MotionButton = motion(Button);
export const MotionCard = motion(Card);

export default {
  pageVariants,
  pageTransition,
  staggerContainer,
  staggerItem,
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  hoverScale,
  hoverLift,
  buttonHover,
  buttonTap,
  cardAnimation,
  cardHover,
  listContainer,
  listItem,
  MotionBox,
  MotionFlex,
  MotionText,
  MotionHeading,
  MotionButton,
  MotionCard,
};