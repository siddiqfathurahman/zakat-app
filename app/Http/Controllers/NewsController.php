<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Comment;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Admin - Render berita list page
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = News::query();

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('excerpt', 'like', "%{$search}%");
                });
            }

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            if ($request->filled('category')) {
                $query->where('category', $request->category);
            }

            $query->orderBy('created_at', 'desc');
            $perPage = $request->get('per_page', 10);
            $news = $query->paginate($perPage);

            // Statistik
            $totalNews = News::count();
            $totalLikes = News::sum('like');
            $totalViews = News::sum('views');
            $totalComments = Comment::count();

            return Inertia::render('dashboard/AdminBerita', [
                'news' => $news->items(),
                'pagination' => [
                    'total' => $news->total(),
                    'count' => $news->count(),
                    'per_page' => $news->perPage(),
                    'current_page' => $news->currentPage(),
                    'last_page' => $news->lastPage(),
                    'from' => $news->firstItem(),
                    'to' => $news->lastItem(),
                ],
                'filters' => [
                    'search' => $request->get('search', ''),
                    'status' => $request->get('status', ''),
                    'category' => $request->get('category', ''),
                ],
                'stats' => [
                    'totalNews' => $totalNews,
                    'totalLikes' => $totalLikes,
                    'totalViews' => $totalViews,
                    'totalComments' => $totalComments,
                ],
            ]);
        } catch (\Exception $e) {
            return Inertia::render('dashboard/AdminBerita', [
                'news' => [],
                'pagination' => [],
                'error' => 'Gagal mengambil data: '.$e->getMessage(),
            ]);
        }
    }

    /**
     * Admin - Render halaman form tambah berita
     */
    public function create()
    {
        return Inertia::render('dashboard/AdminBeritaForm', [
            'news' => null,
        ]);
    }

    /**
     * Admin - Render halaman form edit berita
     */
    public function edit(News $news)
    {
        return Inertia::render('dashboard/AdminBeritaForm', [
            'news' => $news,
        ]);
    }

    /**
     * Store new news
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'category' => 'required|string|max:100',
                'excerpt' => 'required|string|max:500',
                'content' => 'required|string',
                'status' => 'required|in:draft,published',
                'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);

            $validated['author'] = auth()->user()->name;

            if ($request->hasFile('thumbnail')) {
                $file = $request->file('thumbnail');
                $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
                $validated['thumbnail'] = $file->storeAs('news', $filename, 'public');
            }

            // Slug unik
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $counter = 1;
            while (News::where('slug', $slug)->exists()) {
                $slug = $baseSlug.'-'.$counter++;
            }
            $validated['slug'] = $slug;

            $news = News::create($validated);

            ActivityLog::catat(
                'Menambahkan berita: ' . $news->title,
                Auth::id(),
                null,
                $news
            );

            return redirect()->route('news.index')
                ->with('success', 'Berita berhasil dibuat');

        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal membuat berita: '.$e->getMessage())->withInput();
        }
    }

    /**
     * Update news (support method spoofing _method=PUT via POST forceFormData)
     */
    public function update(Request $request, News $news)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'category' => 'required|string|max:100',
                'excerpt' => 'required|string|max:500',
                'content' => 'required|string',
                'status' => 'required|in:draft,published',
                'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);

            $validated['author'] = auth()->user()->name;

            if ($request->hasFile('thumbnail')) {
                if ($news->thumbnail && \Storage::disk('public')->exists($news->thumbnail)) {
                    \Storage::disk('public')->delete($news->thumbnail);
                }
                $file = $request->file('thumbnail');
                $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
                $validated['thumbnail'] = $file->storeAs('news', $filename, 'public');
            }

            // Update slug hanya jika title berubah, pastikan unik
            if ($news->title !== $validated['title']) {
                $baseSlug = Str::slug($validated['title']);
                $slug = $baseSlug;
                $counter = 1;
                while (News::where('slug', $slug)->where('id', '!=', $news->id)->exists()) {
                    $slug = $baseSlug.'-'.$counter++;
                }
                $validated['slug'] = $slug;
            }

            $news->update($validated);

            ActivityLog::catat(
                'Mengedit berita: ' . $news->title,
                Auth::id(),
                null,
                $news
            );

            return redirect()->route('news.index')
                ->with('success', 'Berita berhasil diperbarui');

        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui berita: '.$e->getMessage())->withInput();
        }
    }

    /**
     * Delete news
     */
    public function destroy(News $news)
    {
        try {
            $title = $news->title;
            if ($news->thumbnail && \Storage::disk('public')->exists($news->thumbnail)) {
                \Storage::disk('public')->delete($news->thumbnail);
            }
            $news->delete();

            ActivityLog::catat(
                'Menghapus berita: ' . $title,
                Auth::id()
            );

            return redirect()->route('news.index')
                ->with('success', 'Berita berhasil dihapus');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus berita: '.$e->getMessage());
        }
    }

    /**
     * Increment like count
     */
    public function addLike($slug)
    {
        try {
            $news = News::where('slug', $slug)->firstOrFail();
            $news->increment('like');

            return back();
        } catch (\Exception $e) {
            return back();
        }
    }

    /**
     * Public - Render berita list page
     */
    public function publicIndex(Request $request)
    {
        try {
            $query = News::where('status', 'published')
                ->withCount(['comments' => function ($q) {
                    $q->where('sentiment', 'positive');
                }]);

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('excerpt', 'like', "%{$search}%");
                });
            }

            if ($request->filled('category')) {
                $query->where('category', $request->category);
            }

            $query->orderBy('created_at', 'desc');
            $perPage = $request->get('per_page', 9);
            $news = $query->paginate($perPage);

            return Inertia::render('Berita', [
                'news' => $news->items(),
                'pagination' => [
                    'total' => $news->total(),
                    'count' => $news->count(),
                    'per_page' => $news->perPage(),
                    'current_page' => $news->currentPage(),
                    'last_page' => $news->lastPage(),
                    'from' => $news->firstItem(),
                    'to' => $news->lastItem(),
                ],
                'filters' => [
                    'search' => $request->get('search', ''),
                    'category' => $request->get('category', ''),
                ],
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Berita', [
                'news' => [],
                'pagination' => [],
                'error' => 'Gagal mengambil data: '.$e->getMessage(),
            ]);
        }
    }

    /**
     * Public - Show detail berita
     */
    public function publicShow($slug)
    {
        try {
            $news = News::where('slug', $slug)->firstOrFail();

            if ($news->status === 'draft' && (! auth()->check() || ! auth()->user()->hasRole(['admin', 'super admin']))) {
                abort(404);
            }

            $news->increment('views');

            $comments = $news->comments()
                ->where('sentiment', 'positive')
                ->latest()
                ->get();

            return Inertia::render('BeritaDetail', [
                'news' => $news,
                'comments' => $comments,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            abort(404);
        } catch (\Exception $e) {
            abort(404);
        }
    }
}
