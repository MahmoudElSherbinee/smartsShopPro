<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $product = $this->route('product');
        return Gate::allows('update', $product);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $product = $this->route('product');
        return [
            'name' => 'sometimes|string|max:255',
            'slug' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('products', 'slug')->ignore($product->id)
            ],
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'category_id' => 'sometimes|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    public function messages()
    {
        return [
            'name.string' => 'Product name must be text.',
            'name.max' => 'Product name cannot exceed 255 characters.',
            'slug.string' => 'Slug must be text.',
            'slug.unique' => 'This slug is already taken. Please use another.',
            'slug.max' => 'Slug cannot exceed 255 characters.',
            'price.numeric' => 'Price must be a number.',
            'price.min' => 'Price cannot be negative.',
            'stock.integer' => 'Stock must be a whole number.',
            'stock.min' => 'Stock cannot be negative.',
            'category_id.exists' => 'Selected category does not exist.',
            'image.image' => 'File must be an image.',
            'image.max' => 'Image size must not exceed 2MB.',
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->slug === null && $this->name) {
            $this->merge(
                [
                    'slug' => Str::slug($this->name)
                ]
            );
        }
    }

    public function attributes(): array
    {
        return [
            'name' => 'product name',
            'slug' => 'URL slug',
            'price' => 'price',
            'stock' => 'stock quantity',
            'category_id' => 'category',
            'image' => 'product image',
        ];
    }
}
