<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TestLog;

class TestLogController extends Controller {
    public function store(Request $request){
        $log = TestLog::create([
            'message' => $request->message
        ]);
        return response()->json(['success'=>true, 'log'=>$log]);
    }

    public function index(){
        return TestLog::all();
    }
}
