
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface ProjectFiltersProps {
  onFiltersChange: (sortBy: string, filterBy: string, searchQuery: string) => void;
}

const ProjectFilters = ({ onFiltersChange }: ProjectFiltersProps) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onFiltersChange(value, filterBy, searchQuery);
  };

  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    onFiltersChange(sortBy, value, searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onFiltersChange(sortBy, filterBy, value);
  };

  return (
    <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between bg-muted/30 p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects or creators..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="ending_soon">Ending Soon</SelectItem>
              <SelectItem value="most_funded">Most Funded</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterBy} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="funding">Funding</SelectItem>
              <SelectItem value="deliverable_available">Awaiting Delivery</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => handleFilterChange('all')}>
          All
        </Button>
        <Button variant="outline" size="sm" onClick={() => console.log('Filter by experimental')}>
          Experimental
        </Button>
        <Button variant="outline" size="sm" onClick={() => console.log('Filter by music')}>
          Music
        </Button>
        <Button variant="outline" size="sm" onClick={() => console.log('Filter by comics')}>
          Comics
        </Button>
      </div>
    </div>
  );
};

export default ProjectFilters;
