import { useState, useEffect } from "react";
import { Student } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

interface StudentDataTableProps {
  students: Student[];
  isLoading?: boolean;
  error?: Error | null;
}

interface FilterOption {
  column: string;
  value: string;
}

export function StudentDataTable({ 
  students = [], 
  isLoading = false, 
  error = null 
}: StudentDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  // Extract available columns from the first student
  useEffect(() => {
    if (students.length > 0) {
      const columns = Object.keys(students[0]).filter(
        key => !['_id', '__v'].includes(key)
      );
      setAvailableColumns(columns);
    }
  }, [students]);

  // Handle adding a new filter
  const addFilter = () => {
    if (filterColumn && filterValue) {
      setFilters([...filters, { column: filterColumn, value: filterValue }]);
      setFilterColumn("");
      setFilterValue("");
    }
  };

  // Remove a filter
  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  // Apply search and filters to the data
  const filteredStudents = students.filter((student) => {
    // Apply search term
    const matchesSearch = Object.values(student).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply all filters
    const matchesFilters = filters.every((filter) => {
      const studentValue = student[filter.column]?.toString().toLowerCase() || '';
      return studentValue.includes(filter.value.toLowerCase());
    });

    return matchesSearch && matchesFilters;
  });

  if (isLoading) {
    return <div>Loading student data...</div>;
  }

  if (error) {
    return <div>Error loading student data. Please try again later.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters {filters.length > 0 && `(${filters.length})`}
        </Button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="p-4 border rounded-lg space-y-4">
          <div className="flex flex-col md:flex-row gap-2">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={filterColumn}
              onChange={(e) => setFilterColumn(e.target.value)}
            >
              <option value="">Select column</option>
              {availableColumns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
            <Input
              placeholder="Filter value..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <Button onClick={addFilter}>Add Filter</Button>
          </div>

          {/* Active Filters */}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm"
                >
                  <span className="font-medium">{filter.column}:</span>
                  <span>{filter.value}</span>
                  <button
                    onClick={() => removeFilter(index)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters([])}
                className="ml-auto"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Data Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {availableColumns.map((column) => (
                <TableHead key={column} className="font-bold">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student._id}>
                  {availableColumns.map((column) => (
                    <TableCell key={`${student._id}-${column}`}>
                      {student[column]?.toString() || '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={availableColumns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
