<?php

namespace App\Events;

use App\Models\RealtimeQurban;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RealtimeQurbanUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $realtimeQurban;
    public $statusType; // 'sembelih', 'potong', or 'timbang'

    /**
     * Create a new event instance.
     */
    public function __construct(RealtimeQurban $realtimeQurban, string $statusType)
    {
        $this->realtimeQurban = $realtimeQurban;
        $this->statusType = $statusType;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('realtime-qurban'),
            new Channel("realtime-qurban.{$this->realtimeQurban->jenis_hewan}.{$this->realtimeQurban->nomor_hewan}"),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->realtimeQurban->id,
            'jenis_hewan' => $this->realtimeQurban->jenis_hewan,
            'nomor_hewan' => $this->realtimeQurban->nomor_hewan,
            'status_sembelih' => $this->realtimeQurban->status_sembelih,
            'status_potong' => $this->realtimeQurban->status_potong,
            'status_timbang' => $this->realtimeQurban->status_timbang,
            'berat_kg' => $this->realtimeQurban->berat_kg,
            'waktu_sembelih' => $this->realtimeQurban->waktu_sembelih?->timezone('Asia/Jakarta')->format('H:i'),
            'waktu_potong' => $this->realtimeQurban->waktu_potong?->timezone('Asia/Jakarta')->format('H:i'),
            'waktu_timbang' => $this->realtimeQurban->waktu_timbang?->timezone('Asia/Jakarta')->format('H:i'),
            'statusType' => $this->statusType,
        ];
    }

    /**
     * Get the event name.
     */
    public function broadcastAs(): string
    {
        return 'realtime-qurban.updated';
    }
}
