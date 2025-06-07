import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams, Routes, Route, Outlet } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Heart,
  Briefcase,
  Building2,
  ChevronRight,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  DollarSign,
  UserCheck,
  Clock
} from 'lucide-react';

import api from '../../services/api'; // Import your actual API service
import { useTheme } from "../../context/ThemeProvider"; // Import useTheme
import ProgramStatsCard from '../../components/programs/ProgramStatsCard';
import DivisionCard from '../../components/programs/DivisionCard';
import ProgramCard from '../../components/programs/ProgramCard';
import BeneficiariesTable from '../../components/programs/BeneficiariesTable'; // Added import
// Import Beneficiary Forms
import EducationBeneficiaryForm from '../../components/programs/forms/EducationBeneficiaryForm';
import MicrofundBeneficiaryForm from '../../components/programs/forms/MicrofundBeneficiaryForm';
import RescueBeneficiaryForm from '../../components/programs/forms/RescueBeneficiaryForm';
import VocationalTrainerForm from '../../components/programs/forms/VocationalTrainerForm'; 
import VocationalTraineeForm from '../../components/programs/forms/VocationalTraineeForm'; 
// Import Beneficiary Update Forms
import MicrofundBeneficiaryUpdateForm from '../../components/programs/forms/MicrofundBeneficiaryUpdateForm';
import EducationBeneficiaryUpdateForm from '../../components/programs/forms/EducationBeneficiaryUpdateForm';
import RescueBeneficiaryUpdateForm from '../../components/programs/forms/RescueBeneficiaryUpdateForm';
import VocationalTrainerUpdateForm from '../../components/programs/forms/VocationalTrainerUpdateForm'; // New
import VocationalTraineeUpdateForm from '../../components/programs/forms/VocationalTraineeUpdateForm'; // New

import ProgramEditForm from '../../components/programs/ProgramEditForm'; // Import the new form
// Import Beneficiary Detail Modals
import MicrofundBeneficiaryDetailModal from '../../components/programs/details/MicrofundBeneficiaryDetailModal';
import EducationBeneficiaryDetailModal from '../../components/programs/details/EducationBeneficiaryDetailModal';
import RescueBeneficiaryDetailModal from '../../components/programs/details/RescueBeneficiaryDetailModal';
import VocationalTrainerDetailModal from '../../components/programs/details/VocationalTrainerDetailModal'; // New
import VocationalTraineeDetailModal from '../../components/programs/details/VocationalTraineeDetailModal'; // New
import ConfirmDeleteModal from '../../components/shared/ConfirmDeleteModal'; // Import the new modal

// Loading Component
const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex justify-center items-center p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
    </div>
  );
};

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="text-center py-8 text-red-500">
    <div className="text-red-400 mb-2">⚠️</div>
    <p className="mb-4">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

// Main Programs Component
const ProgramsManagement = () => {
  const navigate = useNavigate();  
  const { theme } = useTheme(); // Use the themeconst { theme } = useTheme(); // Use the theme
  const { '*': pathSuffix } = useParams(); // Captures everything after /programs/

  // Parsed URL segments state
  const [currentDivisionId, setCurrentDivisionId] = useState(null);
  const [currentProgramId, setCurrentProgramId] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
   const [currentVocationalTrainerId, setCurrentVocationalTrainerId] = useState(null); // For vocational trainees view

  // State for selected data objects (useful for names in breadcrumbs, etc.)
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedVocationalTrainer, setSelectedVocationalTrainer] = useState(null); // For context when viewing trainees

  const [divisions, setDivisions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showEditProgramModal, setShowEditProgramModal] = useState(false); // State for edit modal

  // State to control modal visibility, driven by useEffect watching currentAction
  const [showAddBeneficiaryModal, setShowAddBeneficiaryModal] = useState(false);

  // State for beneficiary detail modals
  const [selectedBeneficiaryForDetails, setSelectedBeneficiaryForDetails] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // State for beneficiary edit modals
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for beneficiary delete confirmation
  const [deletingBeneficiary, setDeletingBeneficiary] = useState(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isDeletingBeneficiary, setIsDeletingBeneficiary] = useState(false);


  useEffect(() => {
    const segments = pathSuffix ? pathSuffix.split('/') : [];
    let divId = null;
    let progId = null;
    let action = null;
    let trainerIdForTrainees = null;

    // Expected: division/:divId/program/:progId/action
    if (segments.length >= 2 && segments[0] === 'division') {
      divId = segments[1];
      if (segments.length >= 4 && segments[2] === 'program') {
        progId = segments[3];
        if (segments.length >= 5) {
          action = segments[4]; // e.g., 'add-beneficiary'
          if (programNameFromPath(segments) === 'vocational' && segments[4] === 'trainers' && segments.length >= 6) {
            trainerIdForTrainees = segments[5];
            if (segments.length >= 7) {
              action = segments[6]; // e.g. 'add-trainee'
            } else {
              action = null; // Viewing trainees list
            }
          }
        }
      }
    }
    setCurrentDivisionId(divId);
    setCurrentProgramId(progId);
    setCurrentAction(action);
    setCurrentVocationalTrainerId(trainerIdForTrainees);
  }, [pathSuffix]);

  // Fetch divisions
  const fetchDivisions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/programs/divisions/');
      setDivisions(response.data.results || []);
    } catch (err) {
      console.error('Error fetching divisions:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch divisions');
      setDivisions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch programs
  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/programs/programs/');
      setPrograms(response.data.results || []);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch programs');
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch beneficiaries based on program
  const fetchBeneficiaries = useCallback(async (program) => {
    if (!program || !program.name || !program.division_name_display) {
      setError("Cannot fetch beneficiaries: Program details are incomplete.");
      setBeneficiaries([]);
      return;
    }

    setLoading(true);
    setError(null);
    setBeneficiaries([]); // Clear previous beneficiaries

    try {
      let endpoint = '';
      const divisionName = program.division_name_display.toLowerCase();
      const programName = program.name.toLowerCase();
      
      // Construct endpoint based on program type
      // This switch assumes specific endpoint structures. Adjust as per your API.
      switch (programName) {
        case 'education':
          endpoint = `/api/programs/${divisionName}/education/`;
          break;
        case 'microfund':
          endpoint = `/api/programs/${divisionName}/microfund/`;
          break;
        case 'rescue':
          endpoint = `/api/programs/${divisionName}/rescue/`;
          break;
        case 'vocational':
          if (currentVocationalTrainerId) { // If a trainer ID is set, fetch their trainees
            endpoint = `/api/programs/${divisionName}/vocational-trainers/${currentVocationalTrainerId}/trainees/`;
          } else { // Otherwise, fetch trainers
            endpoint = `/api/programs/${divisionName}/vocational-trainers/`;
          }
         break; // <-- Removed duplicate line and added break
        default:
          // Fallback or error if program type is unknown for beneficiary fetching
          console.warn(`Unknown program type for fetching beneficiaries: ${programName}`);
          setError(`Beneficiary endpoint not defined for program type: ${program.name}`);
          setLoading(false);
          return;
      }
      
      const response = await api.get(endpoint);
      setBeneficiaries(response.data.results || []);
    } catch (err) {
      console.error('Error fetching beneficiaries:', err);
      setError(err.response?.data?.detail || err.message || `Failed to fetch beneficiaries for ${program.name}`);
      setBeneficiaries([]);
    } finally {
      setLoading(false);
    }
  }, [currentVocationalTrainerId]);

  // Initial data fetch for divisions and all programs
  useEffect(() => {
    fetchDivisions();
    fetchPrograms();
  }, [fetchDivisions, fetchPrograms]);

  // Memoize selected division and program to stabilize their references
  const stableSelectedDivision = useMemo(() => {
    return currentDivisionId ? divisions.find(d => String(d.id) === currentDivisionId) : null;
  }, [currentDivisionId, divisions]);

  const stableSelectedProgram = useMemo(() => {
    return currentProgramId && stableSelectedDivision ? programs.find(p => String(p.id) === currentProgramId && String(p.division) === stableSelectedDivision.id) : null;
  }, [currentProgramId, stableSelectedDivision, programs]);

  // Effect to update the actual state for selectedDivision and selectedProgram
  useEffect(() => {
    setSelectedDivision(stableSelectedDivision);
    setSelectedProgram(stableSelectedProgram);
  }, [stableSelectedDivision, stableSelectedProgram]);

  // Effect to fetch beneficiaries
  useEffect(() => {
    setError(null); // Clear previous errors on navigation
    if (stableSelectedProgram) {
      fetchBeneficiaries(stableSelectedProgram);
    } else {
      // If no program is selected, or if program details are not yet resolved,
      // clear beneficiaries. This handles navigating away from a program view.
      setBeneficiaries([]);
    }
  }, [stableSelectedProgram, fetchBeneficiaries]); // Core dependencies that should trigger a fetch.

  // Effect to control add beneficiary/trainer/trainee modal visibility
  useEffect(() => {
    if (stableSelectedProgram && (currentAction === 'add-beneficiary' || currentAction === 'add-trainer' || currentAction === 'add-trainee')) {
      setShowAddBeneficiaryModal(true);
    } else {
      setShowAddBeneficiaryModal(false);
    }
  }, [stableSelectedProgram, currentAction]);

  // Effect to set selectedVocationalTrainer
  useEffect(() => {
    const fetchAndSetTrainerDetails = async (trainerIdToFetch) => {
      if (!stableSelectedProgram || stableSelectedProgram.name.toLowerCase() !== 'vocational') {
        // Should not happen if currentVocationalTrainerId is set, but as a safeguard
        if (selectedVocationalTrainer !== null) setSelectedVocationalTrainer(null);
        return;
      }
      // setLoading(true); // Consider a more specific loading state for this individual fetch
      try {
        const divisionName = stableSelectedProgram.division_name_display.toLowerCase();
        // Ensure this endpoint exists and returns a single trainer object
        const response = await api.get(`/api/programs/${divisionName}/vocational-trainers/${trainerIdToFetch}/`);
        setSelectedVocationalTrainer(response.data);
      } catch (err) {
        console.error(`Error fetching trainer details for ID ${trainerIdToFetch}:`, err);
        // setError(`Failed to load details for trainer ${trainerIdToFetch}. Form may not work correctly.`);
        if (selectedVocationalTrainer !== null) setSelectedVocationalTrainer(null); // Clear if fetch fails
      } finally {
        // setLoading(false);
      }
    };

    if (currentVocationalTrainerId && stableSelectedProgram && stableSelectedProgram.name.toLowerCase() === 'vocational') {
      // If selectedVocationalTrainer is not set, or its ID doesn't match the current one from URL,
      // fetch the trainer's details. This handles direct loads/refreshes.
      if (!selectedVocationalTrainer || String(selectedVocationalTrainer.id) !== String(currentVocationalTrainerId)) {
        fetchAndSetTrainerDetails(currentVocationalTrainerId);
      }
      // If selectedVocationalTrainer is already correctly set (e.g., by handleViewTrainees), this condition prevents re-fetch.
    } else {
      // If no currentVocationalTrainerId, or not in vocational program context, ensure selected trainer is cleared.
      if (selectedVocationalTrainer !== null) {
        setSelectedVocationalTrainer(null);
      }
    }
  }, [currentVocationalTrainerId, stableSelectedProgram, selectedVocationalTrainer]); // Removed beneficiaries and loading

   const programNameFromPath = (segments) => {
    if (segments.length >= 4 && segments[2] === 'program' && programs.length > 0) {
        const prog = programs.find(p => String(p.id) === segments[3]);
        return prog ? prog.name.toLowerCase() : null;
    }
    return null;
  };

  // Determine current view level based on parsed IDs
  const getViewLevel = () => {
    if (currentProgramId && currentDivisionId) return 'beneficiaries';
    if (currentDivisionId) return 'programs';
    return 'divisions';
  };
  const currentViewLevel = getViewLevel();

  const handleDivisionSelect = (division) => {
    // If currently viewing divisions, navigate forward to programs for this division
    if (currentViewLevel === 'divisions') {
      navigate(`/dashboard/compass/programs/division/${division.id}`);
    } 
    // If currently viewing programs or beneficiaries, this is likely a breadcrumb click
    // Navigate back to programs list for the current division
    else if (currentViewLevel === 'beneficiaries' && currentDivisionId) {
       navigate(`/dashboard/compass/programs/division/${currentDivisionId}`);
    } else if (currentViewLevel === 'programs') {
      navigate('/dashboard/compass/programs');
    }
  };


  const handleProgramSelect = (program) => {
    // currentDivisionId should be set if we are in a state to select a program
    if (currentDivisionId) {
      navigate(`/dashboard/compass/programs/division/${currentDivisionId}/program/${program.id}`);
    } else if (selectedDivision) { // Fallback if divisionIdFromUrl is not yet set (less likely with proper useEffect)
      navigate(`/dashboard/compass/programs/division/${selectedDivision.id}/program/${program.id}`);
    } else {
      console.error("Cannot select program without a division context.");
      // Optionally navigate to an error page or show an inline error
    }
  };

  const handleBackNavigation = () => {
    if (currentViewLevel === 'beneficiaries' && currentDivisionId) {
      navigate(`/dashboard/compass/programs/division/${currentDivisionId}`);
    } else if (currentViewLevel === 'programs') {
      navigate('/dashboard/compass/programs');
    }
  };

  const handleOpenAddBeneficiaryForm = () => {
    // Navigate to the URL that signifies the form should be open
    if (currentDivisionId && currentProgramId) {
      if (selectedProgram?.name.toLowerCase() === 'vocational') {
        if (currentVocationalTrainerId) { // If viewing trainees, add a trainee
          navigate(`/dashboard/compass/programs/division/${currentDivisionId}/program/${currentProgramId}/trainers/${currentVocationalTrainerId}/add-trainee`);
        } else { // If viewing trainers, add a trainer
          navigate(`/dashboard/compass/programs/division/${currentDivisionId}/program/${currentProgramId}/add-trainer`);
        }
      } else { // For other program types
        navigate(`/dashboard/compass/programs/division/${currentDivisionId}/program/${currentProgramId}/add-beneficiary`);
      }
    }
  };

  const handleCloseAddBeneficiaryForm = () => {
    // Navigate back to the beneficiaries list URL (without /add-beneficiary)
    if (currentDivisionId && currentProgramId) {
       if (selectedProgram?.name.toLowerCase() === 'vocational' && currentVocationalTrainerId) {
        // If was adding trainee, go back to trainees list for that trainer
        navigate(`/dashboard/compass/programs/division/${currentDivisionId}/program/${currentProgramId}/trainers/${currentVocationalTrainerId}`);
      } else {
        // Go back to the main list for the program (beneficiaries or trainers)
        navigate(`/dashboard/compass/programs/division/${currentDivisionId}/program/${currentProgramId}`);
      }
    }
  };
  const handleBeneficiaryAdded = () => {
    // Refetch beneficiaries for the current program to include the new one
    if (selectedProgram) fetchBeneficiaries(selectedProgram);
    handleCloseAddBeneficiaryForm(); // Close modal by navigating
  };

  const handleTrainerAdded = () => { // Specific handler for when a trainer is added
    if (selectedProgram) fetchBeneficiaries(selectedProgram); // Refetches trainers
    handleCloseAddBeneficiaryForm();
  };
  const handleTraineeAdded = () => { // Specific handler for when a trainee is added
    if (selectedProgram && currentVocationalTrainerId) fetchBeneficiaries(selectedProgram); // Refetches trainees for the current trainer
    handleCloseAddBeneficiaryForm();
  };

  // Handler to open the edit program modal
  const handleEditProgram = (programToEdit) => {
    setSelectedProgram(programToEdit); // Set the program to be edited
    setShowEditProgramModal(true);
  };
  const handleCloseEditProgramForm = () => {
    setShowEditProgramModal(false); // Simply close the modal
  };

  const handleOpenBeneficiaryDetailModal = (beneficiary) => {
    setSelectedBeneficiaryForDetails(beneficiary);
    setIsDetailModalOpen(true);
  };

  const handleCloseBeneficiaryDetailModal = () => {
    setSelectedBeneficiaryForDetails(null);
    setIsDetailModalOpen(false);
  };

  // Handlers for editing beneficiaries
  const handleOpenEditBeneficiaryModal = (beneficiaryToEdit) => {
    setEditingBeneficiary(beneficiaryToEdit);
    setIsEditModalOpen(true);
  };

  const handleCloseEditBeneficiaryModal = () => {
    setIsEditModalOpen(false);
    setEditingBeneficiary(null);
  };

  const handleBeneficiaryUpdated = (updatedBeneficiary) => {
    // Refetch beneficiaries for the current program to include the updated one
    if (selectedProgram) fetchBeneficiaries(selectedProgram);
    handleCloseEditBeneficiaryModal();
  };

  // Handlers for deleting beneficiaries
  const getBeneficiaryName = (beneficiary, programType) => {
    if (!beneficiary) return 'this beneficiary';
    switch (programType?.toLowerCase()) {
      case 'education': return beneficiary.student_name || 'this beneficiary';
      case 'microfund': return beneficiary.person_name || 'this beneficiary';
      case 'rescue': return beneficiary.child_name || 'this beneficiary';
      case 'vocational-trainer': return beneficiary.trainer_name || 'this trainer';
      case 'vocational-trainee': return beneficiary.trainee_name || 'this trainee';
      default: return 'this beneficiary';
    }
  };

  const handleOpenConfirmDeleteModal = (beneficiaryToDelete) => {
    setDeletingBeneficiary(beneficiaryToDelete);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleCloseConfirmDeleteModal = () => {
    setIsConfirmDeleteModalOpen(false);
    setDeletingBeneficiary(null);
  };

  const handleConfirmSoftDelete = async () => {
    if (!deletingBeneficiary || !selectedProgram) {
      setError("Cannot delete: Beneficiary or Program details are missing.");
      return;
    }
    setIsDeletingBeneficiary(true);
    setError(null);

    try {
      const divisionName = selectedProgram.division_name_display.toLowerCase();
      const programName = selectedProgram.name.toLowerCase();
      const beneficiaryId = deletingBeneficiary.id;

     let endpoint = '';

      if (programName === 'vocational') {
        // If currentVocationalTrainerId is set, we are in trainee context, so deleting a trainee.
        // Otherwise, we are in trainer context, so deleting a trainer.
        if (currentVocationalTrainerId) { 
          endpoint = `/api/programs/${divisionName}/vocational-trainers/${currentVocationalTrainerId}/trainees/${beneficiaryId}/soft-delete/`;
        } else { // It's a trainer
          endpoint = `/api/programs/${divisionName}/vocational-trainers/${beneficiaryId}/soft-delete/`;
        }
      } else {
        endpoint = `/api/programs/${divisionName}/${programName}/${beneficiaryId}/soft-delete/`;
      }

      await api.delete(endpoint); // Use DELETE method as required by the backend
      
      // Success: Refetch beneficiaries and close modal
      if (selectedProgram) fetchBeneficiaries(selectedProgram);
      handleCloseConfirmDeleteModal();
    } catch (err) {
      console.error("Error soft-deleting beneficiary:", err);
      setError(err.response?.data?.detail || err.message || "Failed to send beneficiary to recycle bin.");
      // Optionally, keep the modal open on error or display error within the modal
    } finally {
      setIsDeletingBeneficiary(false);
    }
  };

  // Handler for viewing trainees of a specific trainer
  const handleViewTrainees = (trainer) => {
    if (currentDivisionId && currentProgramId) {
      setSelectedVocationalTrainer(trainer); // Set the selected trainer object directly
      navigate(`/dashboard/compass/programs/division/${currentDivisionId}/program/${currentProgramId}/trainers/${trainer.id}`);
    }
  };

  // Determine the specific type (trainer, trainee, or other beneficiary type) for modals
  const specificItemTypeForModals = useMemo(() => {
    if (!selectedProgram) return 'beneficiary'; // Default
    const baseName = selectedProgram.name.toLowerCase();
    if (baseName === 'vocational') {
      return currentVocationalTrainerId ? 'vocational-trainee' : 'vocational-trainer';
    }
    return baseName; // e.g., 'education', 'microfund'
  }, [selectedProgram, currentVocationalTrainerId]);

  const deletingBeneficiaryName = useMemo(() => {
    return getBeneficiaryName(deletingBeneficiary, specificItemTypeForModals);
  }, [deletingBeneficiary, specificItemTypeForModals]);

  const modalItemTypeString = useMemo(() => {
    if (specificItemTypeForModals === 'vocational-trainer') return 'trainer';
    if (specificItemTypeForModals === 'vocational-trainee') return 'trainee';
    return 'beneficiary';
  }, [specificItemTypeForModals]);

  const addNewButtonLabel = useMemo(() => {
    if (!selectedProgram) return 'Add New';
    const baseName = selectedProgram.name.toLowerCase();
    if (baseName === 'vocational') {
      return currentVocationalTrainerId ? 'Add New Trainee' : 'Add New Trainer';
    }
    return `Add New Beneficiary`; // Generic label for other types
  }, [selectedProgram, currentVocationalTrainerId]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const viewLevel = getViewLevel();

    if (viewLevel === 'divisions') {
      return divisions.filter(d => 
        d.name.toLowerCase().includes(term) || 
        d.description.toLowerCase().includes(term)
      );
    } else if (viewLevel === 'programs') {
      // Only filter programs if a division is actually selected and available
      if (selectedDivision) {
        return programs.filter(p => 
          // Ensure robust comparison, assuming p.division is the ID of the division
          String(p.division) === String(selectedDivision.id) && 
          (p.name.toLowerCase().includes(term) ||
           p.description.toLowerCase().includes(term))
        );
      }
      return []; // If no valid division is selected, show no programs for this view
    } else if (viewLevel === 'beneficiaries') {
      return beneficiaries.filter(b => {
        const searchableText = Object.values(b).join(' ').toLowerCase();
        return searchableText.includes(term);
      });
    }
    
    return [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, divisions, programs, beneficiaries, currentDivisionId, selectedDivision, currentViewLevel]); // currentViewLevel depends on currentDivisionId

  // Calculate stats
  const stats = useMemo(() => {
    if (currentViewLevel === 'divisions') {
      return [
        { icon: Building2, title: 'Total Divisions', value: divisions.length, color: 'blue' },
        { 
          icon: DollarSign, title: 'Total Budget (Divisions)', 
          value: `$${divisions.reduce((sum, d) => sum + (parseFloat(d.total_budget) || 0), 0).toLocaleString()}`, color: 'green' 
        },
        { icon: Users, title: 'Total Programs', value: programs.length, color: 'purple' },
        { icon: UserCheck, title: 'Active Programs', value: programs.length, color: 'orange' }
      ];
    } else if (currentViewLevel === 'programs') {
      const divisionPrograms = selectedDivision 
        ? programs.filter(p => p.division === selectedDivision.id)
        : programs;
      
      return [
        { icon: Briefcase, title: 'Total Programs', value: divisionPrograms.length, color: 'blue' },
        { 
          icon: DollarSign, title: 'Monthly Budget (Programs)', 
          value: `$${divisionPrograms.reduce((sum, p) => sum + (parseFloat(p.monthly_budget) || 0), 0).toLocaleString()}`, color: 'green' 
        },
        { 
          icon: Calendar, title: 'Annual Budget (Programs)', 
          value: `$${divisionPrograms.reduce((sum, p) => sum + (parseFloat(p.annual_budget) || 0), 0).toLocaleString()}`, color: 'purple' 
        },
        { icon: Users, title: 'Total Beneficiaries', value: beneficiaries.length, color: 'orange' } // This will be 0 until beneficiaries are fetched
      ];
    } else {
      return [
        { icon: Users, title: 'Total Beneficiaries', value: beneficiaries.length, color: 'blue' },
        { icon: CheckCircle, title: 'Active', value: beneficiaries.filter(b => b.is_active !== false).length, color: 'green' },
        { icon: Clock, title: 'Recent', value: beneficiaries.filter(b => new Date(b.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length, color: 'purple' },
        { icon: UserCheck, title: 'Completed', value: beneficiaries.filter(b => b.is_reunited || !b.under_training).length, color: 'orange' }
      ]; // These beneficiary stats depend on the fields in your beneficiary data
    }
  }, [divisions, programs, beneficiaries, currentViewLevel, selectedDivision]);

  // Render breadcrumb
  const renderBreadcrumb = () => (
    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <span className={!currentDivisionId ? 'text-blue-600 font-medium' : 'cursor-pointer hover:text-blue-600'}
            onClick={() => navigate('/dashboard/compass/programs')}>
        All Divisions
      </span>
      {currentDivisionId && selectedDivision && (
        <>
          <ChevronRight className="w-4 h-4" />
          <span className={currentProgramId ? 'cursor-pointer hover:text-blue-600' : 'text-blue-600 font-medium'}
                onClick={() => navigate(`/dashboard/compass/programs/division/${selectedDivision.id}`)}>
            {selectedDivision.name} Programs
          </span>
        </>
      )}
      {currentProgramId && selectedProgram && (
       selectedProgram.name.toLowerCase() === 'vocational' ? (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className={!currentVocationalTrainerId ? 'text-blue-600 font-medium capitalize' : 'cursor-pointer hover:text-blue-600 capitalize'}
                  onClick={() => navigate(`/dashboard/compass/programs/division/${currentDivisionId}/program/${selectedProgram.id}`)}>
              {selectedProgram.name} Trainers
            </span>
            {currentVocationalTrainerId && selectedVocationalTrainer && (
              <><ChevronRight className="w-4 h-4" /><span className="text-blue-600 font-medium capitalize">{selectedVocationalTrainer.trainer_name}'s Trainees</span></>
            )}
          </>
        ) : (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className={'text-blue-600 font-medium capitalize'}>{selectedProgram.name} Beneficiaries</span>
          </>
        )
      )}
    </div>
  );

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "light"
          ? "bg-gray-50 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {currentViewLevel !== 'divisions' && (
              <button 
                onClick={handleBackNavigation}
                className={`p-2 ${theme === 'light' ? "text-gray-900" : "text-gray-200"} hover:bg-gray-100 rounded-lg transition-colors`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className={`text-3xl font-bold  ${theme === 'light' ? "text-gray-900" : "text-gray-200"}`}>Programs Management</h1>
              <p className={`${theme === 'light' ? "text-gray-600" : "text-gray-100"} mt-1`}>
                {currentViewLevel === 'divisions' && 'Overview of all program divisions'}
                {currentViewLevel === 'programs' && selectedDivision && `Programs in ${selectedDivision.name} division`}
                {currentViewLevel === 'beneficiaries' && selectedProgram && selectedProgram.name.toLowerCase() !== 'vocational' && `Beneficiaries in ${selectedProgram.name} program`}
                {currentViewLevel === 'beneficiaries' && selectedProgram && selectedProgram.name.toLowerCase() === 'vocational' && !currentVocationalTrainerId && `Trainers in ${selectedProgram.name} program`}
                {currentViewLevel === 'beneficiaries' && selectedProgram && selectedProgram.name.toLowerCase() === 'vocational' && currentVocationalTrainerId && selectedVocationalTrainer &&
                  `Trainees for ${selectedVocationalTrainer.trainer_name} in ${selectedProgram.name}`
                }
              </p>
            </div>
            {/* Edit Program Button - Show only on Beneficiaries view */}
            {currentViewLevel === 'beneficiaries' && selectedProgram && (
              <button
                onClick={() => handleEditProgram(selectedProgram)} // Pass selectedProgram
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
                  theme === "light"
                    ? "border-gray-300 text-gray-700"
                    : "border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Edit className="w-4 h-4" />
                <span>Edit Program</span>
              </button>
            )}
          </div>
        </div>

        {/* Breadcrumb */}
        {renderBreadcrumb()}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <ProgramStatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${currentViewLevel}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
                theme === "light"
                  ? "border-gray-300"
                  : "border-gray-700 hover:bg-gray-700"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {loading && <LoadingSpinner size="lg" />}
        
        {error && (
          <ErrorMessage 
            message={error}
            onRetry={() => {
              setError(null); // Clear error before retrying
              if (
                currentProgramId &&
                selectedProgram &&
                currentViewLevel === "beneficiaries"
              ) {
                fetchBeneficiaries(selectedProgram);
              } else if (currentDivisionId && selectedDivision) {
                fetchPrograms(); // Or specific logic if programs for a division failed
              } else {
                fetchDivisions();
                fetchPrograms();
              }
            }} 
          />
        )}

        {!loading && !error && (
          <div className={currentViewLevel === 'beneficiaries' ? '' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
            {currentViewLevel === 'divisions' && filteredData.map(division => (
              <DivisionCard 
                key={division.id} 
                division={division} 
                onSelect={handleDivisionSelect}
              />
            ))}
            {currentViewLevel === 'programs' && filteredData.map(program => (
              <ProgramCard 
                key={program.id} 
                program={program} 
                onSelect={handleProgramSelect}
                onEdit={handleEditProgram} // Pass the new handler here
              />
            ))}
            {currentViewLevel === 'beneficiaries' && selectedProgram && (
              <>
                {/* Persistent Add New Button */}
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={handleOpenAddBeneficiaryForm}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      theme === "light"
                        ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        : "bg-blue-500 hover:bg-blue-400 focus:ring-blue-400"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    {addNewButtonLabel}
                  </button>
                </div>

                <BeneficiariesTable
                  beneficiaries={filteredData} // This will be trainers or trainees list
                  programType={                    
                    selectedProgram.name.toLowerCase() === 'vocational' 
                      ? (currentVocationalTrainerId ? 'vocational-trainee' : 'vocational-trainer') 
                      : selectedProgram.name.toLowerCase()
                  }
                  loading={loading} 
                  error={error}
                  onAddNewBeneficiary={handleOpenAddBeneficiaryForm}
                  onViewDetails={handleOpenBeneficiaryDetailModal} // Pass the handler
                  onEditBeneficiary={handleOpenEditBeneficiaryModal} // Pass the edit handler
                  onDeleteBeneficiary={handleOpenConfirmDeleteModal} // Pass the delete handler
                  searchTerm={searchTerm} // Pass searchTerm for empty state message
                  onViewTrainees={selectedProgram.name.toLowerCase() === 'vocational' && !currentVocationalTrainerId ? handleViewTrainees : undefined}
                />
              </>              
            )}
          </div> 
        )}

        {!loading && !error && filteredData.length === 0 && currentViewLevel !== 'beneficiaries' && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {currentViewLevel} found
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : `No ${currentViewLevel} available at the moment`}
            </p>
          </div>
        )}

        {/* Beneficiary Forms rendered via Routes */}
        <Routes>
          {/* Generic add-beneficiary route */}
          <Route path="division/:divisionIdForForm/program/:programIdForForm/add-beneficiary" element={ 
            (showAddBeneficiaryModal && selectedProgram && selectedProgram.name.toLowerCase() !== 'vocational') ? (
              <>
                {selectedProgram?.name.toLowerCase() === 'education' && (
                  <EducationBeneficiaryForm
                    isOpen={true} // Modal is open because the route matched and showAddBeneficiaryModal is true
                    onClose={handleCloseAddBeneficiaryForm}
                    onBeneficiaryAdded={handleBeneficiaryAdded}
                    programId={selectedProgram.id}
                    divisionName={selectedProgram.division_name_display}
                  />
                )}
                {selectedProgram?.name.toLowerCase() === 'microfund' && (
                  <MicrofundBeneficiaryForm
                    isOpen={true}
                    onClose={handleCloseAddBeneficiaryForm}
                    onBeneficiaryAdded={handleBeneficiaryAdded}
                    programId={selectedProgram.id}
                    divisionName={selectedProgram.division_name_display}
                  />
                )}
                {selectedProgram?.name.toLowerCase() === 'rescue' && (
                  <RescueBeneficiaryForm
                    isOpen={true}
                    onClose={handleCloseAddBeneficiaryForm}
                    onBeneficiaryAdded={handleBeneficiaryAdded}
                    programId={selectedProgram.id}
                    divisionName={selectedProgram.division_name_display}
                  />
                )}
              </>
            ) : null // Or a loading indicator if selectedProgram is not yet available
          }/>
          {/* Vocational Trainer Add Form Route */}
          <Route path="division/:divisionIdForForm/program/:programIdForForm/add-trainer" element={
            (showAddBeneficiaryModal && selectedProgram?.name.toLowerCase() === 'vocational' && !currentVocationalTrainerId) ? (
              <VocationalTrainerForm
                isOpen={true}
                onClose={handleCloseAddBeneficiaryForm}
                onTrainerAdded={handleTrainerAdded}
                programId={selectedProgram.id}
                divisionName={selectedProgram.division_name_display}
              />
            ) : null
          }/>
          {/* Vocational Trainee Add Form Route */}
          <Route path="division/:divisionIdForForm/program/:programIdForForm/trainers/:trainerIdForForm/add-trainee" element={
             (showAddBeneficiaryModal && selectedProgram?.name.toLowerCase() === 'vocational' && currentVocationalTrainerId) ? (
              <VocationalTraineeForm
                isOpen={true}
                onClose={handleCloseAddBeneficiaryForm}
                onTraineeAdded={handleTraineeAdded}
                programId={selectedProgram.id}
                divisionName={selectedProgram.division_name_display}
                trainerId={currentVocationalTrainerId} // Pass the trainerId from URL/state
                trainerAssociationFromProps={selectedVocationalTrainer?.trainer_association}
              />
            ) : null
          }/>
        </Routes>
        <Outlet />
        
        {/* Program Edit Modal */}
        {showEditProgramModal && selectedProgram && (
          <ProgramEditForm
            isOpen={showEditProgramModal}
            onClose={handleCloseEditProgramForm}
            program={selectedProgram}
            onProgramUpdated={fetchPrograms} // Refetch programs list after update
          />
        )}

        {/* Beneficiary Detail Modals */}
        {isDetailModalOpen && selectedBeneficiaryForDetails && selectedProgram && (
          <>
            {selectedProgram.name.toLowerCase() === 'microfund' && (
              <MicrofundBeneficiaryDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseBeneficiaryDetailModal}
                beneficiary={selectedBeneficiaryForDetails}
                programName={selectedProgram.name}
                divisionName={selectedProgram.division_name_display}
                // loading={...} // Pass loading/error if fetching details individually
                // error={...}
              />
            )}
            {selectedProgram.name.toLowerCase() === 'education' && (
              <EducationBeneficiaryDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseBeneficiaryDetailModal}
                beneficiary={selectedBeneficiaryForDetails}
                programName={selectedProgram.name}
                divisionName={selectedProgram.division_name_display}
              />
            )}
            {selectedProgram.name.toLowerCase() === 'rescue' && (
              <RescueBeneficiaryDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseBeneficiaryDetailModal}
                beneficiary={selectedBeneficiaryForDetails}
                programName={selectedProgram.name}
                divisionName={selectedProgram.division_name_display}
              />
            )}
            {selectedProgram.name.toLowerCase() === 'vocational' && (
              currentVocationalTrainerId ? ( // If a trainer is selected, we are viewing a trainee
                <VocationalTraineeDetailModal
                  isOpen={isDetailModalOpen}
                  onClose={handleCloseBeneficiaryDetailModal}
                  beneficiary={selectedBeneficiaryForDetails}
                  programName={selectedProgram.name}
                  divisionName={selectedProgram.division_name_display}
                  trainerName={selectedVocationalTrainer?.trainer_name} // Pass trainer's name for context
                />
              ) : ( // Otherwise, we are viewing a trainer
                <VocationalTrainerDetailModal
                  isOpen={isDetailModalOpen}
                  onClose={handleCloseBeneficiaryDetailModal}
                  beneficiary={selectedBeneficiaryForDetails}
                  programName={selectedProgram.name}
                  divisionName={selectedProgram.division_name_display}
                />
              )
            )}
          </>
        )}

        {/* Beneficiary Update Modals */}
        {isEditModalOpen && editingBeneficiary && selectedProgram && (
          <>
            {selectedProgram.name.toLowerCase() === 'microfund' && (
              <MicrofundBeneficiaryUpdateForm
                isOpen={isEditModalOpen}
                onClose={handleCloseEditBeneficiaryModal}
                existingBeneficiary={editingBeneficiary}
                onBeneficiaryUpdated={handleBeneficiaryUpdated}
                programId={selectedProgram.id}
                divisionName={selectedProgram.division_name_display}
              />
            )}
            {selectedProgram.name.toLowerCase() === 'education' && (
              <EducationBeneficiaryUpdateForm
                isOpen={isEditModalOpen}
                onClose={handleCloseEditBeneficiaryModal}
                existingBeneficiary={editingBeneficiary}
                onBeneficiaryUpdated={handleBeneficiaryUpdated}
                programId={selectedProgram.id}
                divisionName={selectedProgram.division_name_display}
              />
            )}
            {selectedProgram.name.toLowerCase() === 'rescue' && (
              <RescueBeneficiaryUpdateForm
                isOpen={isEditModalOpen}
                onClose={handleCloseEditBeneficiaryModal}
                existingBeneficiary={editingBeneficiary}
                onBeneficiaryUpdated={handleBeneficiaryUpdated}
                programId={selectedProgram.id}
                divisionName={selectedProgram.division_name_display}
              />
            )}
            {selectedProgram.name.toLowerCase() === 'vocational' && (
              currentVocationalTrainerId ? ( // If a trainer is selected, we are editing a trainee
                <VocationalTraineeUpdateForm
                  isOpen={isEditModalOpen}
                  onClose={handleCloseEditBeneficiaryModal}
                  existingBeneficiary={editingBeneficiary}
                  onBeneficiaryUpdated={handleBeneficiaryUpdated}
                  programId={selectedProgram.id}
                  divisionName={selectedProgram.division_name_display}
                  trainerId={currentVocationalTrainerId} // This is the ID of the trainer the trainee belongs to
                  trainerAssociationFromProps={selectedVocationalTrainer?.trainer_association} // Pass trainer's association
                />
              ) : ( // Otherwise, we are editing a trainer
                <VocationalTrainerUpdateForm
                  isOpen={isEditModalOpen}
                  onClose={handleCloseEditBeneficiaryModal}
                  existingBeneficiary={editingBeneficiary}
                  onBeneficiaryUpdated={handleBeneficiaryUpdated}
                  programId={selectedProgram.id}
                  divisionName={selectedProgram.division_name_display}
                />
              )
            )}
          </>
        )}

        {/* Confirm Delete Modal for Beneficiaries */}
        {isConfirmDeleteModalOpen && deletingBeneficiary && selectedProgram && (
          <ConfirmDeleteModal
            isOpen={isConfirmDeleteModalOpen}
            onClose={handleCloseConfirmDeleteModal}
            onConfirm={handleConfirmSoftDelete}
            itemName={deletingBeneficiaryName}
            itemType={modalItemTypeString}
            isProcessing={isDeletingBeneficiary}
            title="Send to Recycle Bin"
            message={`Are you sure you want to send this ${modalItemTypeString} (${deletingBeneficiaryName}) to the recycle bin? Only a Super Admin can restore it.`}
            confirmButtonText="Send to Recycle Bin"
            confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          />
        )}

      </div>
    </div>
  );
};

export default ProgramsManagement;