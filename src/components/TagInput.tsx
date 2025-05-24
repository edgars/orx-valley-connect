
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const { data: allTags } = useBlogTags();
  const { mutate: createTag } = useCreateBlogTag();
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
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, allTags, selectedTags]);

  const addTag = (tag: { id: string; name: string; color: string }) => {
    if (!selectedTags.some(selected => selected.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };

  const createNewTag = () => {
    if (!inputValue.trim()) return;
    
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
        addTag(newTag);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        addTag(suggestions[0]);
      } else if (inputValue.trim()) {
        createNewTag();
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Digite uma tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {suggestions.map((tag) => (
              <button
                key={tag.id}
                onClick={() => addTag(tag)}
                className="w-full px-3 py-2 text-left hover:bg-gray-700 flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="text-white">{tag.name}</span>
              </button>
            ))}
          </div>
        )}
        
        {inputValue.trim() && suggestions.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
            <button
              onClick={createNewTag}
              className="w-full px-3 py-2 text-left hover:bg-gray-700 flex items-center gap-2 text-white"
            >
              <Plus className="w-4 h-4" />
              Criar tag "{inputValue.trim()}"
            </button>
          </div>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color }}
              className="border flex items-center gap-1"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => removeTag(tag.id)}
                className="ml-1 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
