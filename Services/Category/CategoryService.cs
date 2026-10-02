using AutoMapper;
using Online_Job_Management_System.DTOs.Category;
using Online_Job_Management_System.Models;
using Online_Job_Management_System.Repositories;

namespace Online_Job_Management_System.Services.Category
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<CategoryDto?> GetByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            return category == null ? null : _mapper.Map<CategoryDto>(category);
        }

        public async Task<IEnumerable<CategoryDto>> GetRootCategoriesAsync()
        {
            var categories = await _categoryRepository.GetRootCategoriesAsync();
            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }

        public async Task<IEnumerable<CategoryDto>> GetSubCategoriesAsync(int parentId)
        {
            var categories = await _categoryRepository.GetSubCategoriesAsync(parentId);
            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }

        public async Task<CategoryDto?> GetWithSubCategoriesAsync(int id)
        {
            var category = await _categoryRepository.GetWithSubCategoriesAsync(id);
            return category == null ? null : MapToDtoWithChildren(category);
        }

        public async Task<IEnumerable<CategoryDto>> GetActiveCategoriesAsync()
        {
            var categories = await _categoryRepository.GetActiveCategoriesAsync();
            return _mapper.Map<IEnumerable<CategoryDto>>(categories);
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
        {
            var category = _mapper.Map<Online_Job_Management_System.Models.Category>(dto);
            category.CreatedAt = DateTime.UtcNow;
            await _categoryRepository.AddAsync(category);
            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<CategoryDto?> UpdateAsync(int id, UpdateCategoryDto dto)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return null;

            if (!string.IsNullOrEmpty(dto.Name))
                category.Name = dto.Name;
            if (dto.Description != null)
                category.Description = dto.Description;
            if (dto.Icon != null)
                category.Icon = dto.Icon;
            if (dto.ParentCategoryId.HasValue)
                category.ParentCategoryId = dto.ParentCategoryId.Value;
            if (dto.DisplayOrder.HasValue)
                category.DisplayOrder = dto.DisplayOrder.Value;
            if (dto.IsActive.HasValue)
                category.IsActive = dto.IsActive.Value;

            category.UpdatedAt = DateTime.UtcNow;
            await _categoryRepository.UpdateAsync(category);

            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return false;

            // Check if has subcategories
            var subCategories = await _categoryRepository.GetSubCategoriesAsync(id);
            if (subCategories.Any()) return false;

            await _categoryRepository.DeleteAsync(id);
            return true;
        }

        private CategoryDto MapToDtoWithChildren(Online_Job_Management_System.Models.Category category)
        {
            var dto = _mapper.Map<CategoryDto>(category);
            if (category.SubCategories != null)
            {
                dto.SubCategories = category.SubCategories.Select(MapToDtoWithChildren).ToList();
            }
            return dto;
        }
    }
}
