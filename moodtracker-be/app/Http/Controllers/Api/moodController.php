<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mood;
use Dotenv\Util\Str;
use Illuminate\Http\Request;

class moodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Mood::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string',
            'mood' => 'required|string',
            'date' => 'nullable|date',
        ]);

        $mood = Mood::create($request->all());

        return response()->json([
            'message' => 'Mood created successfully',
            'data' => $mood,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $mood = Mood::find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $mood = Mood::findOrFail($id);

        $request->validate([
            'nama' => 'sometimes|required|string',
            'mood' => 'sometimes|required|string',
            'date' => 'sometimes|nullable|date',
        ]);
        
        $mood->update($request->all());

        return response()->json($mood);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $mood = Mood::findOrFail($id);
        $mood->delete();

        return response()->json([
            'message' => 'Mood deleted successfully',
        ], 200);
    }
}
