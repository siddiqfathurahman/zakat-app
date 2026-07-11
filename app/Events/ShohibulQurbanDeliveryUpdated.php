<?php

namespace App\Events;

use App\Models\Shohibulqurban;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ShohibulQurbanDeliveryUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $shohibulQurban;

    /**
     * Create a new event instance.
     */
    public function __construct(Shohibulqurban $shohibulQurban)
    {
        $this->shohibulQurban = $shohibulQurban;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('shohibul-delivery'),
            new Channel("jatah-distribution.{$this->shohibulQurban->rt}"),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->shohibulQurban->id,
            'nama' => $this->shohibulQurban->nama,
            'rt' => $this->shohibulQurban->rt,
            'rw' => $this->shohibulQurban->rw,
            'jenis_hewan' => $this->shohibulQurban->jenis_hewan,
            'nomor_hewan' => $this->shohibulQurban->nomor_hewan,
            'status_kirim' => $this->shohibulQurban->status_kirim,
            'waktu_kirim' => $this->shohibulQurban->waktu_kirim?->timezone('Asia/Jakarta')->format('H:i'),
        ];
    }

    /**
     * Get the event name.
     */
    public function broadcastAs(): string
    {
        return 'delivery.updated';
    }
}
