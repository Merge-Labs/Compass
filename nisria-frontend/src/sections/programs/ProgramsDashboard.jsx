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
import ProgramStatsCard from '../../components/programs/ProgramStatsCard';
import DivisionCard from '../../components/programs/DivisionCard';
import ProgramCard from '../../components/programs/ProgramCard';
import BeneficiariesTable from '../../components/programs/BeneficiariesTable'; // Added import
// Import Beneficiary Forms
import EducationBeneficiaryForm from '../../components/programs/forms/EducationBeneficiaryForm';
import MicrofundBeneficiaryForm from '../../components/programs/forms/MicrofundBeneficiaryForm';
import RescueBeneficiaryForm from '../../components/programs/forms/RescueBeneficiaryForm';
import VocationalBeneficiaryForm from '../../components/programs/forms/VocationalBeneficiaryForm';


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
  const { '*': pathSuffix } = useParams(); // Captures everything after /programs/

  // Parsed URL segments state
  const [currentDivisionId, setCurrentDivisionId] = useState(null);
  const [currentProgramId, setCurrentProgramId] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  // const [currentBeneficiaryId, setCurrentBeneficiaryId] = useState(null); // For future use

  // State for selected data objects (useful for names in breadcrumbs, etc.)
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [divisions, setDivisions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // State to control modal visibility, driven by useEffect watching currentAction
  const [showAddBeneficiaryModal, setShowAddBeneficiaryModal] = useState(false);

  useEffect(() => {
    const segments = pathSuffix ? pathSuffix.split('/') : [];
    let divId = null;
    let progId = null;
    let action = null;

    // Expected: division/:divId/program/:progId/action
    if (segments.length >= 2 && segments[0] === 'division') {
      divId = segments[1];
      if (segments.length >= 4 && segments[2] === 'program') {
        progId = segments[3];
        if (segments.length >= 5) {
          action = segments[4]; // e.g., 'add-beneficiary'
        }
      }
    }
    setCurrentDivisionId(divId);
    setCurrentProgramId(progId);
    setCurrentAction(action);
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
          // Example: vocational might have sub-types or a generic endpoint
          // For now, assuming a general structure, but this might need refinement
          // based on your actual API for vocational beneficiaries (trainees/trainers)
          endpoint = `/api/programs/${divisionName}/vocational-trainers/`;
          break;
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
  }, []);

  // Initial data fetch for divisions and all programs
  useEffect(() => {
    fetchDivisions();
    fetchPrograms();
  }, [fetchDivisions, fetchPrograms]);

  // Effect to react to parsed URL params, fetch data, and set selected objects / modal states
  useEffect(() => {
    setError(null); // Clear previous errors on navigation

    const division = currentDivisionId ? divisions.find(d => String(d.id) === currentDivisionId) : null;
    const program = currentProgramId && division ? programs.find(p => String(p.id) === currentProgramId && String(p.division) === currentDivisionId) : null;

    if (currentDivisionId) {
      setSelectedDivision(division || null);
      if (currentProgramId) {
        setSelectedProgram(program || null);
        if (program) {
          fetchBeneficiaries(program);
        } else {
          setBeneficiaries([]);
          if (programs.length > 0 && !loading && currentProgramId) setError(`Program with ID ${currentProgramId} not found in division ${division?.name}.`);
        }
      } else {
        setSelectedProgram(null);
        setBeneficiaries([]);
      }
    } else {
      setSelectedDivision(null);
      setSelectedProgram(null);
      setBeneficiaries([]);
    }

    // Control modal visibility based on action
    if (currentAction === 'add-beneficiary' && program) {
      setShowAddBeneficiaryModal(true);
    } else {
      setShowAddBeneficiaryModal(false);
    }

  }, [currentDivisionId, currentProgramId, currentAction, divisions, programs, fetchBeneficiaries]);

  // Determine current view level based on parsed IDs
  const getViewLevel = () => {
    if (currentProgramId && currentDivisionId) return 'beneficiaries';
    if (currentDivisionId) return 'programs';
    return 'divisions';
  };
  const currentViewLevel = getViewLevel();

  const handleDivisionSelect = (division) => {
    navigate(`/dashboard/compass/programs/division/${division.id}`);
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
      navigate(`/dashboard/compass/programs/division/${currentDivisionId}/program/${currentProgramId}/add-beneficiary`);
    }
  };

  const handleCloseAddBeneficiaryForm = () => {
    // Navigate back to the beneficiaries list URL (without /add-beneficiary)
    if (currentDivisionId && currentProgramId) {
      navigate(`/dashboard/compass/programs/division/${currentDivisionId}/program/${currentProgramId}`);
    }
  };
  const handleBeneficiaryAdded = () => {
    // Refetch beneficiaries for the current program to include the new one
    if (selectedProgram) fetchBeneficiaries(selectedProgram);
    handleCloseAddBeneficiaryForm(); // Close modal by navigating
  };

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
  }, [searchTerm, divisions, programs, beneficiaries, currentDivisionId, selectedDivision]); // currentViewLevel depends on currentDivisionId

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
        <>
          <ChevronRight className="w-4 h-4" />
          <span className={'text-blue-600 font-medium capitalize'}>
            {selectedProgram.name} Beneficiaries
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {currentViewLevel !== 'divisions' && (
              <button 
                onClick={handleBackNavigation}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Programs Management</h1>
              <p className="text-gray-600 mt-1">
                {currentViewLevel === 'divisions' && 'Overview of all program divisions'}
                {currentViewLevel === 'programs' && selectedDivision && `Programs in ${selectedDivision.name} division`}
                {currentViewLevel === 'beneficiaries' && selectedProgram && `Beneficiaries in ${selectedProgram.name} program`}
              </p>
            </div>
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
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
              if (currentProgramId && selectedProgram) {
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
              />
            ))}
            {currentViewLevel === 'beneficiaries' && selectedProgram && (
              <BeneficiariesTable
                beneficiaries={filteredData}
                programType={selectedProgram?.name.toLowerCase()}
                loading={loading} // Pass loading/error states down
                error={error}
                onAddNewBeneficiary={handleOpenAddBeneficiaryForm} // Pass the handler here
              />
            )}
          </div> 
        )}

        {!loading && !error && filteredData.length === 0 && (
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
          <Route path="division/:divisionIdForForm/program/:programIdForForm/add-beneficiary" element={
            showAddBeneficiaryModal && selectedProgram ? (
              <>
                {selectedProgram.name.toLowerCase() === 'education' && (
                  <EducationBeneficiaryForm
                    isOpen={true} // Modal is open because the route matched and showAddBeneficiaryModal is true
                    onClose={handleCloseAddBeneficiaryForm}
                    onBeneficiaryAdded={handleBeneficiaryAdded}
                    programId={selectedProgram.id}
                    divisionName={selectedProgram.division_name_display}
                  />
                )}
                {selectedProgram.name.toLowerCase() === 'microfund' && (
                  <MicrofundBeneficiaryForm
                    isOpen={true}
                    onClose={handleCloseAddBeneficiaryForm}
                    onBeneficiaryAdded={handleBeneficiaryAdded}
                    programId={selectedProgram.id}
                    divisionName={selectedProgram.division_name_display}
                  />
                )}
                {selectedProgram.name.toLowerCase() === 'rescue' && (
                  <RescueBeneficiaryForm
                    isOpen={true}
                    onClose={handleCloseAddBeneficiaryForm}
                    onBeneficiaryAdded={handleBeneficiaryAdded}
                    programId={selectedProgram.id}
                    divisionName={selectedProgram.division_name_display}
                  />
                )}
                {selectedProgram.name.toLowerCase() === 'vocational' && (
                  <VocationalBeneficiaryForm
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
          {/* Add other routes for editing beneficiaries, etc. here */}
        </Routes>
        <Outlet />

      </div>
    </div>
  );
};

export default ProgramsManagement;