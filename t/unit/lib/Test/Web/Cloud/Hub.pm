use MooseX::Declare;
use Method::Signatures::Simple;

class Test::Common::Hub with (Agua::Common::Hub,
	Test::Table,
	Test::Common,
	Table::Main,
	Util::Logger,
	Web::Group::Privileges,
	Table::Common)  {

use Data::Dumper;
use Test::More;
use Test::DatabaseRow;
use DBase::Factory;
use Ops::Main;
use Engine::Instance;
use Conf::Yaml;
use FindBin qw($Bin);

# Ints
has 'log'		=>  ( isa => 'Int', is => 'rw', default => 2 );  
has 'printlog'		=>  ( isa => 'Int', is => 'rw', default => 5 );

# Strings
has 'logfile'       => ( isa => 'Str|Undef', is => 'rw' );
has 'login'       	=> ( isa => 'Str|Undef', is => 'rw' );
has 'password'      => ( isa => 'Str|Undef', is => 'rw' );
has 'owner'	        => ( isa => 'Str|Undef', is => 'rw' );
has 'package'		=> ( isa => 'Str|Undef', is => 'rw' );
has 'remoterepo'	=> ( isa => 'Str|Undef', is => 'rw' );
has 'dumpfile'		=> ( isa => 'Str|Undef', is => 'rw' );
has 'database'		=> ( isa => 'Str|Undef', is => 'rw' );
#has 'sessionid'     => ( isa => 'Str|Undef', is => 'rw' );

#### Objects
has 'db'	=> ( isa => 'DBase::MySQL', is => 'rw', required => 0 );
has 'json'			=> ( isa => 'HashRef', is => 'rw', required => 0 );
has 'conf' 	=> (
	is =>	'rw',
	isa => 'Conf::Yaml',
	default	=>	sub { Conf::Yaml->new(	memory	=>	1	);	}
);
has 'head' 	=> (
	is =>	'rw',
	'isa' => 'Engine::Instance',
	default	=>	sub { Engine::Instance->new();	}
);

####////}}

method BUILD ($hash) {
	foreach my $key ( keys %$hash ) {
		$self->$key($hash->{$key}) if defined $hash->{$key} and $self->can($key);
	}
	
	#### SET HEAD OPS CONF 
	$self->head->ops()->conf($self->conf());
}

#### TEST GET REPO ACCESS INFO
method testGetHub {
	diag("Testing getHub");

	##### LOAD DATABASE
	$self->setUpTestDatabase();
	$self->setDatabaseHandle();

	#### SET REPO INFO
	my $expected_token = "999999999999999999999999999999999999999";
	my $username	=	$self->conf()->getKey("database", "TESTUSER");
	my $login		=	$self->login();
	my $hash		=	{
		username	=>	$username,
		login		=>	$login,
		token		=>	$expected_token
	};
	my $table 		=	"hub";
	my $keys 		= 	["username", "login", "token"];
	$self->_addToTable($table, $hash, $keys);
	
	#### RETRIEVE REPO INFO
	my $hub 		= 	$self->_getHub($username);
	my $token		=	$hub->{token};	
	ok($token eq $expected_token, "getHub");

	#### CLEAN UP
	$self->_removeFromTable($table, $hash, $keys);
}

#### TEST ADD ACCESS TOKEN
method testAddRemoveHubToken {
	#### **** CREATE GITHUB OAUTH ACCESS TOKEN USING login AND password
	diag("Testing addHubToken");

	##### LOAD DATABASE
	$self->setUpTestDatabase();
	$self->setDatabaseHandle();

	#### SET HEAD->OPS DBOBJECT
	$self->head->ops()->db($self->db());

	my $username	=	$self->conf()->getKey("database", "TESTUSER");
	my $login		=	$self->login();
	my $password	=	$self->password();
	my $hubtype		=	"github";
	my $token		=	"mytoken";
	my $tokenid		=	"mytokenid";

	my $data		=	{
		username	=>	$username,
		login		=>	$login,
		token		=>	$token,
		tokenid		=>	$tokenid,
		hubtype		=>	$hubtype
	};
	$self->logDebug("data", $data);
	
	#### INSERT
	$self->_addHubToken($data);
	
	#### CONFIRM ADDED TO TABLE	
	my $table = "hub";
	my $keys = ["username", "login"];
	my $intable = $self->db()->inTable($table, $data, $keys);
	$self->logDebug("intable", $intable);
	ok($intable, "added to table");

	#### DELETE TOKEN
	$self->_removeHubToken($data);

	#### CONFIRM DELETED FROM TABLE	
	ok(! $self->db()->inTable($table, $data, $keys), "deleted from table");	
}



}