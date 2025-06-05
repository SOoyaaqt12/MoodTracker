<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Lifehub;
use App\Models\Mood;
use Illuminate\Http\Request;

class lifehubController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Lifehub::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'kegiatan' => 'required|string',
            'kategori' => 'required|in:pribadi,kerja,belajar',
            'status' => 'required|boolean',
            'date' => 'required|date',
        ]);

        $lifehub = Lifehub::create($request->all());

        return response()->json([
            'message' => 'Lifehub created successfully',
            'data' => $lifehub,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $lifehub = Lifehub::find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $lifehub = Lifehub::findOrFail($id);

        $request->validate([
            'kegiatan' => 'required|string',
            'kategori' => 'required|in:pribadi,kerja,belajar',
            'status' => 'required|boolean',
            'date' => 'required|date',
        ]);

        $lifehub->update($request->all());

        return response()->json([
            'message' => 'Lifehub updated successfully',
            'data' => $lifehub,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $lifehub = Lifehub::findOrFail($id);
        $lifehub->delete();

        return response()->json([
            'message' => 'Lifehub deleted successfully',
        ], 204);
    }
}