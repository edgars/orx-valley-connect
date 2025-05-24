
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBlogTags, useCreateBlogTag } from '@/hooks/useBlogTags';
import { Plus, X } from 'lucide-react';

interface TagInputProps {
  selectedTags: Array<{ id: string; name: string; color: string }>;
  onTagsChange: (tags: Array<{ id: string; name: string; color: string }>) => void;
}

const TagInput = ({ selectedTags, onTagsChange }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ id: string; name: string; color: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const { data: allTags, refetch: refetchTags } = useBlogTags();
  const { mutate: createTag, isPending: isCreatingTag } = useCreateBlogTag();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.trim() && allTags) {
      const filtered = allTags
        .filter(tag => 
          tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.some(selected => selected.id === tag.id)
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  }, [inputValue, allTags, selectedTags]);

  const addTag = (tag: { id: string; name: string; color: string }) => {
    if (!selectedTags.some(selected => selected.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setInputValue('');
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };

  const createNewTag = () => {
    if (!inputValue.trim() || isCreatingTag) return;
    
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const slug = inputValue
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');

    createTag({
      name: inputValue.trim(),
      slug,
      color: randomColor
    }, {
      onSuccess: (newTag) => {
        // Immediately add the new tag to selected tags
        addTag(newTag);
        // Refetch all tags to update the cache
        refetchTags();
        // Clear input and suggestions
        setInputValue('');
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.focus();
      },
      onError: (error) => {
        console.error('Error creating tag:', error);
        // Don't clear input on error so user can try again
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && highlightedIndex >= 0) {
        addTag(suggestions[highlightedIndex]);
      } else if (suggestions.length > 0) {
        addTag(suggestions[0]);
      } else if (inputValue.trim() && !isCreatingTag) {
        createNewTag();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Only hide suggestions if the focus is not moving to a suggestion button
    if (!e.relatedTarget || !e.relatedTarget.closest('[data-suggestion]')) {
      setTimeout(() => {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }, 200);
    }
  };

  const exactMatch = allTags?.find(tag => 
    tag.name.toLowerCase() === inputValue.toLowerCase()
  );

  const shouldShowCreateOption = inputValue.trim() && 
    !exactMatch && 
    !selectedTags.some(tag => tag.name.toLowerCase() === inputValue.toLowerCase());

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Digite uma tag e pressione Enter..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => {
            if (inputValue.trim() && (suggestions.length > 0 || shouldShowCreateOption)) {
              setShowSuggestions(true);
            }
          }}
          disabled={isCreatingTag}
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
        />
        
        {showSuggestions && (suggestions.length > 0 || shouldShowCreateOption) && (
          <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto animate-fade-in">
            {suggestions.map((tag, index) => (
              <button
                key={tag.id}
                data-suggestion
                onClick={(e) => {
                  e.preventDefault();
                  addTag(tag);
                }}
                className={`w-full px-3 py-2 text-left flex items-center gap-2 transition-colors ${
                  index === highlightedIndex 
                    ? 'bg-gray-700' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="text-white truncate">{tag.name}</span>
              </button>
            ))}
            
            {shouldShowCreateOption && (
              <button
                data-suggestion
                onClick={(e) => {
                  e.preventDefault();
                  createNewTag();
                }}
                disabled={isCreatingTag}
                className="w-full px-3 py-2 text-left hover:bg-gray-700 flex items-center gap-2 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 text-green-400" />
                <span>
                  {isCreatingTag ? 'Criando...' : `Criar tag "${inputValue.trim()}"`}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Tags selecionadas:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag, index) => (
              <Badge
                key={tag.id}
                style={{ 
                  backgroundColor: tag.color + '20', 
                  color: tag.color, 
                  borderColor: tag.color,
                  animationDelay: `${index * 50}ms`
                }}
                className="border flex items-center gap-2 px-3 py-1 animate-scale-in hover:scale-105 transition-transform duration-200"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="font-medium">{tag.name}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag.id)}
                  className="ml-1 hover:text-red-400 transition-colors p-0.5 rounded-full hover:bg-red-500/20"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagInput;
