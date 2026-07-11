<?php

namespace App\Events;

use App\Models\Penerimaqurban;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PenerimaqurbanStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $penerimaqurban;

    /**
     * Create a new event instance.
     */
    public function __construct(Penerimaqurban $penerimaqurban)
    {
        $this->penerimaqurban = $penerimaqurban;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('penerima-qurban'),
            new Channel("penerima-qurban.rt.{$this->penerimaqurban->rt}"),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->penerimaqurban->id,
            'nama' => $this->penerimaqurban->nama,
            'rt' => $this->penerimaqurban->rt,
            'rw' => $this->penerimaqurban->rw,
            'agama' => $this->penerimaqurban->agama,
            'jiwa' => $this->penerimaqurban->jiwa,
            'jatah_sapi' => $this->penerimaqurban->jatah_sapi,
            'jatah_kambing' => $this->penerimaqurban->jatah_kambing,
            'status' => $this->penerimaqurban->status,
            'kode_unik' => $this->penerimaqurban->kode_unik,
        ];
    }

    /**
     * Get the event name.
     */
    public function broadcastAs(): string
    {
        return 'penerima-qurban.updated';
    }
}