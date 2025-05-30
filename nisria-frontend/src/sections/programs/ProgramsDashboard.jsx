import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  Shield, 
  Briefcase,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Building2,
  ChevronRight,
  BarChart3,
  UserCheck,
  Settings,
  Download,
  Upload,
  ChevronLeft,
  Calendar,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const ProgramsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [showBeneficiaryTable, setShowBeneficiaryTable] = useState(false);
  
  // Mock data - replace with actual API calls
  const [divisions] = useState([
    {
      id: 1,
      name: 'nisria',
      displayName: 'Nisria',
      description: 'Education, MicroFund & Rescue Programs',
      programs: ['education', 'microfund', 'rescue'],
      beneficiaries: 1247,
      status: 'active'
    },
    {
      id: 2,
      name: 'maisha',
      displayName: 'Maisha',
      description: 'Vocational Training Programs',
      programs: ['vocational'],
      beneficiaries: 856,
      status: 'active'
    }
  ]);

  // Mock beneficiary data
  const [beneficiaries] = useState([
    {
      id: 1,
      fullName: 'Sarah Johnson',
      position: 'Student',
      dateOfBirth: '15.03.2005',
      experience: 2,
      skills: 'Mathematics, Science',
      amount: 500,
      program: 'Education',
      division: 'Nisria',
      phone: '+254 700 123 456',
      email: 'sarah.j@email.com',
      location: 'Nairobi',
      status: 'Active'
    },
    {
      id: 2,
      fullName: 'Michael Ochieng',
      position: 'Entrepreneur',
      dateOfBirth: '22.08.1992',
      experience: 5,
      skills: 'Business Development',
      amount: 1200,
      program: 'MicroFund',
      division: 'Nisria',
      phone: '+254 700 234 567',
      email: 'michael.o@email.com',
      location: 'Kisumu',
      status: 'Active'
    },
    {
      id: 3,
      fullName: 'Grace Wanjiku',
      position: 'Trainee',
      dateOfBirth: '10.12.1998',
      experience: 1,
      skills: 'Tailoring, Fashion Design',
      amount: 800,
      program: 'Vocational Training',
      division: 'Maisha',
      phone: '+254 700 345 678',
      email: 'grace.w@email.com',
      location: 'Nakuru',
      status: 'Active'
    },
    {
      id: 4,
      fullName: 'David Kimani',
      position: 'Beneficiary',
      dateOfBirth: '05.07.2010',
      experience: 0,
      skills: 'N/A',
      amount: 300,
      program: 'Rescue',
      division: 'Nisria',
      phone: '+254 700 456 789',
      email: 'guardian.d@email.com',
      location: 'Mombasa',
      status: 'Active'
    },
    {
      id: 5,
      fullName: 'Lucy Akinyi',
      position: 'Graduate',
      dateOfBirth: '18.09.1995',
      experience: 3,
      skills: 'Accounting, Computer Skills',
      amount: 600,
      program: 'Education',
      division: 'Nisria',
      phone: '+254 700 567 890',
      email: 'lucy.a@email.com',
      location: 'Eldoret',
      status: 'Completed'
    }
  ]);

  const programTypes = {
    education: {
      name: 'Education',
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600',
      lightColor: 'bg-blue-50',
      description: 'Student education programs and scholarships',
      count: 324,
      divisions: ['nisria']
    },
    microfund: {
      name: 'MicroFund',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      lightColor: 'bg-green-50',
      description: 'Microfinance and small business funding',
      count: 567,
      divisions: ['nisria']
    },
    rescue: {
      name: 'Rescue',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      lightColor: 'bg-red-50',
      description: 'Child rescue and protection services',
      count: 89,
      divisions: ['nisria']
    },
    vocational: {
      name: 'Vocational Training',
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      lightColor: 'bg-purple-50',
      description: 'Skills training and job placement',
      count: 445,
      divisions: ['maisha']
    }
  };

  const ProgramCard = ({ program, division }) => {
    const IconComponent = program.icon;
    
    return (
      <div className="group relative overflow-hidden">
        {/* Glassmorphism card */}
        <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 ${program.lightColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <IconComponent className="w-7 h-7 text-gray-700" />
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20">
                  <Settings className="w-4 h-4 text-gray-700" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20">
                  <MoreVertical className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">{program.name}</h3>
            <p className="text-sm text-gray-600 mb-6 line-clamp-2">{program.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{program.count}</span>
                <p className="text-gray-600 font-medium">Beneficiaries</p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-2 transition-all duration-300" />
            </div>
          </div>
          
          {/* Gradient bottom section */}
          <div className={`px-6 py-4 bg-gradient-to-r ${program.color} rounded-b-2xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-sm text-white hover:text-white/80 font-medium transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button className="flex items-center space-x-2 text-sm text-white/80 hover:text-white transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  <span>Reports</span>
                </button>
              </div>
              <span className="px-3 py-1 text-xs rounded-full bg-white/20 text-white font-medium backdrop-blur-sm">
                {division.displayName}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DivisionCard = ({ division }) => {
    return (
      <div className="group relative overflow-hidden">
        <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{division.displayName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{division.description}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                division.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {division.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl font-bold text-gray-800">{division.programs.length}</div>
                <div className="text-sm text-gray-600 font-medium">Programs</div>
              </div>
              <div className="text-center p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl font-bold text-gray-800">{division.beneficiaries.toLocaleString()}</div>
                <div className="text-sm text-gray-600 font-medium">Beneficiaries</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <button 
                onClick={() => setSelectedDivision(division)}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                <span>Manage Programs</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 transition-colors">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatsCard = ({ icon: Icon, label, value, change, gradient = "from-blue-500 to-blue-600" }) => (
    <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 font-semibold ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );

  const BeneficiaryTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBeneficiaries, setSelectedBeneficiaries] = useState([]);

    const filteredBeneficiaries = beneficiaries.filter(beneficiary =>
      beneficiary.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.division.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelectBeneficiary = (id) => {
      setSelectedBeneficiaries(prev =>
        prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
      );
    };

    const toggleSelectAll = () => {
      setSelectedBeneficiaries(
        selectedBeneficiaries.length === filteredBeneficiaries.length 
          ? [] 
          : filteredBeneficiaries.map(b => b.id)
      );
    };

    return (
      <div className="space-y-6">
        {/* Table Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowBeneficiaryTable(false)}
              className="p-2 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Beneficiary Management</h2>
              <p className="text-sm text-gray-600">Manage and track all program beneficiaries</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 text-gray-700 font-medium">
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 text-gray-700 font-medium">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            {selectedBeneficiaries.length > 0 && (
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium">
                <Trash2 className="w-4 h-4" />
                <span>Delete ({selectedBeneficiaries.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search beneficiaries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-gray-800 placeholder-gray-500 min-w-[300px]"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 text-gray-700 font-medium">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
          <div className="text-sm text-gray-600 font-medium">
            {filteredBeneficiaries.length} of {beneficiaries.length} beneficiaries
          </div>
        </div>

        {/* Table */}
        <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/30 backdrop-blur-sm border-b border-white/20">
                <tr>
                  <th className="text-left py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedBeneficiaries.length === filteredBeneficiaries.length && filteredBeneficiaries.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Full Name</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Program</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Division</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Amount</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Contact</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Status</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBeneficiaries.map((beneficiary, index) => (
                  <tr key={beneficiary.id} className={`border-b border-white/10 hover:bg-white/10 transition-colors ${index % 2 === 0 ? 'bg-white/5' : ''}`}>
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedBeneficiaries.includes(beneficiary.id)}
                        onChange={() => toggleSelectBeneficiary(beneficiary.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {beneficiary.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{beneficiary.fullName}</div>
                          <div className="text-sm text-gray-600">{beneficiary.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                        {beneficiary.program}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700 font-medium">{beneficiary.division}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-800 font-semibold">KSh {beneficiary.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{beneficiary.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{beneficiary.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        beneficiary.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        beneficiary.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {beneficiary.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Glassmorphism Header */}
      <div className="backdrop-blur-lg bg-white/30 border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {showBeneficiaryTable ? 'Beneficiary Management' : 'Programs Management'}
              </h1>
              <p className="text-sm text-gray-600 font-medium mt-1">
                {showBeneficiaryTable ? 'Track and manage all beneficiaries' : 'Manage divisions, programs, and beneficiaries'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {!showBeneficiaryTable && (
                <button 
                  onClick={() => setShowBeneficiaryTable(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 text-gray-700 font-medium"
                >
                  <Users className="w-4 h-4" />
                  <span>Beneficiaries</span>
                </button>
              )}
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
                <Plus className="w-4 h-4" />
                <span>New {showBeneficiaryTable ? 'Beneficiary' : 'Program'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showBeneficiaryTable ? (
          <BeneficiaryTable />
        ) : !selectedDivision ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard 
                icon={Building2} 
                label="Active Divisions" 
                value="2" 
                change={0}
                gradient="from-indigo-500 to-purple-600"
              />
              <StatsCard 
                icon={Users} 
                label="Total Beneficiaries" 
                value="2,103" 
                change={12}
                gradient="from-blue-500 to-blue-600"
              />
              <StatsCard 
                icon={Briefcase} 
                label="Active Programs" 
                value="4" 
                change={0}
                gradient="from-green-500 to-green-600"
              />
              <StatsCard 
                icon={UserCheck} 
                label="This Month" 
                value="156" 
                change={8}
                gradient="from-purple-500 to-purple-600"
              />
            </div>

            {/* Divisions */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Divisions</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 text-gray-700 font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Add Division</span>
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {divisions.map((division) => (
                  <DivisionCard key={division.id} division={division} />
                ))}
              </div>
            </div>

            {/* All Programs Overview */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">All Programs</h2>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 text-gray-700 font-medium">
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 text-gray-700 font-medium">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(programTypes).map(([key, program]) => {
                  const division = divisions.find(d => program.divisions.includes(d.name));
                  return <ProgramCard key={key} program={program} division={division} />;
                })}
              </div>
            </div>
          </>
        ) : (
          // Division-specific view
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setSelectedDivision(null)}
                  className="p-2 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedDivision.displayName} Division</h2>
                  <p className="text-sm text-gray-600 font-medium">{selectedDivision.description}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedDivision.programs.map((programKey) => {
                const program = programTypes[programKey];
                return program ? <ProgramCard key={programKey} program={program} division={selectedDivision} /> : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramsDashboard;